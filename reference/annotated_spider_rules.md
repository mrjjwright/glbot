{"spider_rules": {
    "start_uris": [],              // SHOULD DO scopes are sometimes set with this.
    "sitemap": "",                 //    SHOULD DO
    "truncate_urls_at": [],        // MUST HAVE. I think is already implemented.
    "truncate_url_hash": true,     // MUST HAVE. I think is already implemented.
    "remove_url_param": [],        // MUST HAVE. I think is already implemented.
    "use_sitemaps": true,          // SHOULD DO
    "robots": true,                // SHOULD DO
    "follow_links": true,          // Can maybe ignore this?
    "find_js_links": false,        // Hmmmm interesting. Maybe SHOULD DO this.
    "capture_text": true,          // SHOULD DO
    "check_meta_robots": true,     // SHOULD DO
    "enable_images": false,        // This is HUGE. Maybe we ignore this?
    "download_assets": [],         // This is HUGE. Maybe we ignore this?
    "crawl_delay": 10000,          // MUST HAVE. I think is already implemented.
    "max_pending": 5,              // SHOULD DO
    "max_uri_recursion": 4,        // SHOULD DO
    "headers": {},                 // SHOULD DO
    "login": {},                   // Probably do NOT need
    "login_all_pages": false,      // Probably do NOT need
    "login_page_js": [],           // Probably do NOT need
    "query_selector_clicks": [],   // Probably do NOT need
    "dynamic_scroll": {},          // Hmmmm interesting. Maybe SHOULD DO this.
    "walk_delay_mseconds": null,   // SHOULD DO. Maybe implemented already?
    "exclude_uris": [],            // MUST HAVE. Maybe is already implemented.
    "include_uris": [],            // MUST HAVE. Maybe is already implemented.
    "include_domains": {},         // This is complicated. It's a MUST HAVE unless we say it's not supported.
    "exclude_domains": []          // This is complicated. It's a MUST HAVE unless we say it's not supported.
}}