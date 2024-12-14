# Spider Rules - Key Concepts and Configuration

## Core Concepts

1. **Domain Boundaries**

   - Spiders stay within allowed domains
   - Won't follow external links (e.g., won't go to facebook.com if crawling acme.com)

2. **Starting Points**

   - Every spider needs a start URI
   - Can be inferred from project settings
   - Multiple start URIs possible for targeted crawling

3. **URL Control**
   - **Include/Exclude Patterns**
     - Exclude URIs: Block specific patterns (e.g., `.*` blocks everything)
     - Include URIs: Override exclusions (e.g., allow `/product/*`)
   - **Common Patterns**
     - Single page: Use start URI with follow links off
     - Product catalog: Start at `/product`, include `/product/*` patterns
     - Full site: Start at root with domain limits

## URL Processing

1. **URL Truncation**

   - Handles changing URL parameters
   - Manages session IDs and dynamic parameters
   - Ensures consistent page identification
   - Hash fragment handling (can be disabled with `truncateUrlHash: false`)

2. **Canonical URLs**
   - Used for definitive page versions
   - Helps manage duplicate content

## Performance Controls

1. **Crawl Delay**

   - Default: Adaptive crawling based on response times
   - Configurable in milliseconds
   - Prevents overwhelming target sites

2. **Concurrent Requests**
   - Controls number of simultaneous page requests
   - Configurable via max pending setting
   - Balances speed vs. server load

## Safety Features

1. **Recursion Protection**

   - Prevents infinite loops in URL patterns
   - Sets maximum depth for recursive paths

2. **Headers**
   - Custom header support for authentication
   - User-agent configuration
   - Required for some sites' access control

## Integration Notes

- Spider rules affect both crawling and live site behavior
- Rules are respected by Moxie in production
- Maintains consistency between crawl and live behavior
- Core configurations should be preserved for stability

## Advanced Features

1. **Site Maps**

   - Support for standard site maps
   - Can be disabled if not needed
   - Adds to starting URIs

2. **Robots.txt**

   - Respects robots.txt by default
   - Can be overridden if needed for translation purposes
   - Includes meta robots tag support

3. **Dynamic Content**
   - Support for JavaScript-rendered content
   - Can handle infinite scroll scenarios
   - Configurable wait times for dynamic loading

## Translation-Specific Features

1. **No Translate**

   - Controls what content should not be translated
   - Affects both spider and live behavior

2. **Selective Translation**
   - Can specify elements for translation
   - Handles special cases like iframes and pseudo-elements

## Best Practices

1. **Speed Control**

   - Balance between speed and reliability
   - Use appropriate delays for target site
   - Consider using adaptive crawling

2. **URL Management**

   - Use appropriate truncation rules
   - Handle hash fragments correctly
   - Consider canonical URLs

3. **Resource Usage**
   - Monitor concurrent requests
   - Use appropriate delays
   - Respect server limitations
