import Fuse from 'fuse.js';

/**
 * Normalizes text by:
 * - Converting to lowercase
 * - Trimming spaces
 * - Collapsing multiple spaces into a single space
 * - Treating hyphens as spaces
 * - Removing other general punctuation
 */
export const normalizeText = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/-/g, ' ') // treat hyphens as spaces
    .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?[\]]/g, '') // remove punctuation
    .trim()
    .replace(/\s+/g, ' '); // collapse multiple spaces
};

/**
 * Expands a query with common travel-related aliases and synonyms.
 */
export const expandQuery = (query) => {
  let q = normalizeText(query);
  if (!q) return '';

  // Seater / seats alias (e.g. "7 seater" -> "7 seats", "17 seat" -> "17 seats")
  q = q.replace(/\b(\d+)\s*(?:seater|seat|seats)\b/gi, '$1 seats');
  
  // Common spelling errors / aliases
  q = q.replace(/\blonavla\b/gi, 'lonavala');
  q = q.replace(/\bmahableshwar\b/gi, 'mahabaleshwar');
  q = q.replace(/\binnvoa\b/gi, 'innova');
  q = q.replace(/\bertgia\b/gi, 'ertiga');
  
  // AC / Non-AC synonyms
  q = q.replace(/\bnon\s+ac\b/gi, 'non-ac');
  
  return q;
};

/**
 * Concatenates and normalizes specific search fields from an item to form a searchable index.
 * Handles arrays, objects, booleans (like 'ac'), and numbers (like 'seats') elegantly.
 */
export const getItemSearchContent = (item, searchFields) => {
  return searchFields
    .map((key) => {
      const val = item[key];
      if (val === undefined || val === null) return '';

      if (key === 'ac' && typeof val === 'boolean') {
        return val ? 'ac a/c air conditioned' : 'non-ac non ac';
      }

      if (key === 'seats' && typeof val === 'number') {
        return `${val} seats ${val} seater`;
      }

      if (Array.isArray(val)) {
        return val.map((v) => normalizeText(v)).join(' ');
      }

      if (typeof val === 'object') {
        return Object.values(val)
          .map((v) => normalizeText(v))
          .join(' ');
      }

      return normalizeText(val);
    })
    .join(' ');
};

/**
 * Performs a fuzzy and tiered search over data using Fuse.js.
 * Matches are ranked based on the following priorities:
 * 1. Exact match on primaryKey
 * 2. Starts with query on primaryKey
 * 3. Word starts with query on primaryKey
 * 4. Contains query on primaryKey
 * 5. Contains query on other search fields
 * 6. Fuzzy match via Fuse.js
 */
export const fuseSearch = (data, query, searchFields, primaryKey) => {
  if (!query) {
    return data;
  }

  const expandedQuery = expandQuery(query);
  const queryNormalized = normalizeText(expandedQuery);
  const queryWords = queryNormalized.split(' ').filter(Boolean);

  if (queryWords.length === 0) {
    return data;
  }

  // 1. Initialize Fuse.js for fuzzy typo-tolerance search
  const fuse = new Fuse(data, {
    keys: searchFields,
    threshold: 0.35,
    includeScore: true,
  });

  const fuseResults = fuse.search(expandedQuery);

  // 2. Score and tier each matched result
  const rankedResults = fuseResults.map((res) => {
    const item = res.item;
    const score = res.score ?? 1;

    const mainTextNormalized = normalizeText(item[primaryKey] || '');

    let tier = 6; // Default fuzzy tier

    // Tier 1: Exact match on primaryKey
    if (mainTextNormalized === queryNormalized) {
      tier = 1;
    }
    // Tier 2: Starts with the query on primaryKey
    else if (mainTextNormalized.startsWith(queryNormalized)) {
      tier = 2;
    }
    // Tier 3: Word starts with the query on primaryKey
    else if (
      mainTextNormalized.split(' ').some((word) => word.startsWith(queryNormalized))
    ) {
      tier = 3;
    }
    // Tier 4: Primary key contains the query
    else if (mainTextNormalized.includes(queryNormalized)) {
      tier = 4;
    }
    // Tier 5: Other fields match all query words (non-fuzzy match)
    else {
      const itemSearchContent = normalizeText(getItemSearchContent(item, searchFields));
      const allWordsMatch = queryWords.every((word) => itemSearchContent.includes(word));
      if (allWordsMatch) {
        tier = 5;
      }
    }

    return {
      item,
      score,
      tier,
      mainTextLength: mainTextNormalized.length,
    };
  });

  // 3. Sort by:
  //    - Tier (1 is best)
  //    - Score (lower is better)
  //    - Length of primary display text (shorter is better for exactness)
  rankedResults.sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }
    if (Math.abs(a.score - b.score) > 0.01) {
      return a.score - b.score;
    }
    return a.mainTextLength - b.mainTextLength;
  });

  return rankedResults.map((res) => res.item);
};
