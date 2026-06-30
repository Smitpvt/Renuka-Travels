import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable component to inject Schema.org JSON-LD structured data into the document head.
 * Handles both a single schema object or an array of schema objects.
 */
export default function StructuredData({ data }) {
  if (!data) return null;

  const schemas = Array.isArray(data) ? data : [data];
  const validSchemas = schemas.filter(Boolean);

  if (validSchemas.length === 0) return null;

  return (
    <Helmet>
      {validSchemas.map((schema, index) => {
        const key = schema['@id'] || schema['@type'] || `jsonld-${index}`;
        return (
          <script key={key} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        );
      })}
    </Helmet>
  );
}
