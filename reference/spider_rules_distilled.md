# Spider Rules Core Knowledge

- Spider behavior is controlled by start_uris and follow_links
- Two main modes:
  1. Single page: start_uri + follow_links:false
  2. Full crawl: start_uri + follow_links:true + domain restrictions

Key patterns:

- /product/\* - Crawls product pages and follows links within domain
- Block everything except specific paths using exclude_uris + include_uris override
- URL parameters can be truncated to avoid duplicates
- Domain-specific settings available via include_domains

Common use cases:

1. Single page translation: One start_uri, follow_links:false
2. Product catalog: start_uri:/product, follow_links:true
3. Full site: start_uri:/, domain restrictions
