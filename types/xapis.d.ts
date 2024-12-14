type JliffDisp =
  | 'number'
  | 'time'
  | 'timezone'
  | 'date-time'
  | 'custom-token'
  | 'inline-tag'
  | 'text'

type YesNo = 'yes' | 'no'

type Jliff = {
  text?: string
  kind?: 'sc' | 'ec' | 'ph'
  id?: string
  startRef?: string
  disp?: JliffDisp
  equiv?: string
  subType?: string
  type?: string
  canDelete?: YesNo
  canReorder?: YesNo
  canCopy?: YesNo
}

type Segment = {
  approx_word_count?: number
  avatar_url?: string
  company_name?: string
  confidence_factor?: string
  email?: string
  first_name?: string
  is_ignorable: boolean
  is_staging?: number
  last_name?: string
  num_history?: number
  phone?: string
  pm_status_code?: string
  segment_hash: string
  segment_jliff: Jliff[]
  segment_text: string
  status_code?: string
  tags?: string[]
  target_jliff: Jliff[] | null
  target_text: string
  translation_source?: string
  translation_utc?: string
}

type SegmentTranslationHistory = {
  avatar_url: string
  company_name: string
  confidence_factor: string | number
  created_utc: string
  email: string
  first_name: string
  last_name: string
  phone: string
  pm_status_code: string
  status_code: string
  target: Jliff[]
  target_text: string
  translation_source: string
  translation_tool: string
}

type BlockSegment = {
  [hash: string]: Segment[]
}

type SegmentsObj = {
  [hash: string]: Segment
}

type ProjectTarget = {
  source_lang_code: string
  source_lang_name: string
  target_lang_code: string
  target_lang_name: string
  translation_key: string
}

// Response from /xapis/ProjectTranslation/{project_key}
// TODO: Fix this in the future, missing A LOT of fields, such as "append_to_rtx", "custom_js", and "translation_config"
// TODO: A good amount of the fields are also *not* optional as well
type TranslationKey = {
  append_to_rtx: string
  created_user: string
  created_utc: string
  custom_css: string
  custom_css_hash: string
  custom_js: string
  custom_js_hash: string
  deployment_value: string
  is_active: boolean
  is_live: boolean
  is_monitored: boolean
  is_spider_multi_domain: boolean
  lastmod_user: string
  lastmod_utc: string
  linked_translation_key: string
  live_host: string
  mt_api_code: string
  mt_api_key: string
  mt_category: string
  mt_endpoint: string
  mt_pivot: string
  num_blocks_pretranslated: number
  num_requests_day: number
  num_requests_hour: number
  num_requests_month: number
  num_requests_processed: number
  num_requests_unprocessed: number
  num_requests_year: number
  num_segment_translations: number
  num_segments: number
  num_words_served: number
  num_words_translated: number
  pd_source_lang_code: string
  pd_target_lang_code: string
  preserve_ope_conflicts: number
  pretranslate_mode: string
  project_key: string
  proxy_host: string
  rtx_translation_methods: string
  sitemap_domain: string
  sitemap_enable: number
  sitemap_exclude: string | string[]
  sitemap_folder: string
  sitemap_protocol: string
  sitemap_suffix: string
  source_lang_code: string
  source_lang_name: string
  source_native_name: string
  staging_custom_css: string
  staging_custom_css_hash: string
  staging_custom_js: string
  staging_custom_js_hash: string
  staging_host: string
  target_config: string
  target_config_hash: string
  target_lang_code: string
  target_lang_name: string
  target_name: string
  target_native_name: string
  target_subdir: string
  tmgr_pass: string
  tmgr_project_shortcode: string
  tmgr_project_ticket: string
  tmgr_source_lang_code: string
  tmgr_target_lang_code: string
  tmgr_url: string
  tmgr_user: string
  tms_cleanup_pass: string
  tms_pass: string
  tms_tmlocation: string
  tms_url: string
  tms_user: string
  translation_config: string
  translation_config_hash: string
  translation_edit?: boolean
  translation_key: string
  translation_methods: string
}

type TranslationResponse = {
  status: number
  data: TranslationKey
}

type TranslationConfig = {
  spider_rules: SpiderRules
  translation_rules: TranslationRules
  staging_translation_rules?: TranslationRules
}

type SpiderRules = {
  start_uris: string[]
  sitemap: string | null
  truncate_urls_at: string[] | null
  truncate_url_hash: boolean | null
  remove_url_param: string[] | null
  use_sitemaps: boolean | null
  robots: boolean | null
  follow_links: boolean | null
  find_js_links: boolean | null
  capture_text: boolean | null
  check_meta_robots: boolean | null
  enable_images: boolean | null
  download_assets: ('pdf' | 'word' | 'xls' | 'csv')[] | null
  crawl_delay: number | null
  max_pending: number | null
  max_uri_recursion: number | null
  headers: Record<string, string> | null
  login: {
    type: 'basic'
    username: string
    password: string
  } | null
  login_page_js:
    | {
        async: string
        wait_msecs: number | null
      }[]
    | {
        sync: string
        wait_msecs: number | null
      }[]
    | null
  query_selector_clicks:
    | {
        U: string | null
        selectors: string[]
      }[]
    | null
  dynamic_scroll: {
    scroll: boolean | null
    num_scrolls: number | null
    wait_msecs: number | null
  } | null
  walk_delay_mseconds: number | null
  exclude_uris: string[] | null
  include_uris: string[] | null
  include_domains: Record<
    string,
    {
      use_sitemaps: boolean | null
      robots: boolean | null
      follow_links: boolean | null
      find_js_links: boolean | null
      capture_text: boolean | null
      check_meta_robots: boolean | null
      download_assets: ('pdf' | 'word' | 'xls' | 'csv')[] | null
      crawl_delay: number | null
      max_pending: number | null
      max_uri_recursion: number | null
      headers: Record<string, string> | null
      login: {
        type: 'basic'
        username: string
        password: string
      } | null
      login_page_js:
        | {
            async: string
            wait_msecs: number | null
          }[]
        | {
            sync: string
            wait_msecs: number | null
          }[]
        | null
      query_selector_clicks:
        | {
            U: string | null
            selectors: string[]
          }[]
        | null
      dynamic_scroll: {
        scroll: boolean | null
        num_scrolls: number | null
        wait_msecs: number | null
      } | null
      walk_delay_mseconds: number | null
    }
  > | null
  exclude_domains: string[] | null
}

type TranslationRules = {
  no_translate: UTICX[] | null
  translate: UTICX[] | null
  selective_translate: UDX[] | null
  no_pseudo_translate: UTICX[] | null
  pseudo_translate: UTICX[] | null
  ignore_hidden: UDX[] | null
  ignore_dom: UDX[] | null
  ignore_slots: UTICX[] | null
  iframe_notrans: UDLocation[] | null
  no_image_translate: UTICX[] | null
  image_translate: UTICX[] | null
  no_ami: Record<string, UTIC[]> | null
  ami_selective: boolean | null
  auto_detect: UTICX[] | null
  suppress_mt: UTICX[] | null
  suppress_cache: UTICX[] | null
  set_as_block_tag: UDTICXTags[] | null
  set_as_inline_tag: UDTICXTags[] | null
  block_patterns: UDTICXPattern[] | null
  remove_html_tags: UDTICXTags[] | null
  walk_delay_mseconds: number | null
  adaptive_walk_delay: boolean | null
  max_adaptive_delay_mseconds: number | null
  stats_mseconds: number | null
  tokenize_numbers: boolean | null
  hide_dynamic_content: boolean | null
  throttle_dynamic_content: boolean | null
  throttle_delay_msec: number | null
  keep_active_element: boolean | null
  disable_trust_check: boolean | null
  no_tokenize: UDTICXPatternType[] | null
  tokenize_patterns: UDTICXPatternCookies[] | null
  translate_attributes: UDTICXAttrs[] | null
  no_translate_attributes: UDTICXAttrs[] | null
  translate_inputvalue: UTICX[] | null
  no_translate_inputvalue: UTICX[] | null
  language_selector: UDTICXPositionType[] | null
  language_selector_labels: Record<string, string>[] | null
  disable_shadowroot_prototype: boolean | null
  shadowroot_poll_msecs: number | null
  treat_as_shadowroot: string[]
}

type UX = {
  U?: string
  X: string
  comment?: string
}

type UDX = {
  U?: string
  D?: string
  X: string
  comment?: string
}

type UTIC = {
  U?: string
  D?: string
  T?: string
  I?: string
  C?: string
  comment?: string
}

type UDLocation = {
  U?: string
  D?: string
  location: string
  comment?: string
}

type UTICX = UTIC | UX

type UDTICXTags = UTICX & {
  tags: string[]
  comment?: string
}

type UDTICXPattern = UTICX & {
  pattern: string
}

type UDTICXPatternType = UDTICXPattern & {
  type?: 'custom' | 'dates' | 'timezones' | 'time' | 'numbers'
}

type UDTICXPatternCookies = UDTICXPattern & {
  cookie_from?: string
  cookie_to?: string
}

type UDTICXAttrs = UTICX & {
  attrs: string[]
}

type UDTICXPositionType = UTICX & {
  position: 'first' | 'last'
  type?: 'glgo'
  comment?: string
}

type Group = {
  email: string
  group_key: string
  group_members: User[]
  group_name: string
  permissions: string[]
}

// Use only "project_key" to create a special project group
// Use "translation_key" to create a special translation group
// Use "prefix" and "project_key" fields in the JSON request to create a special group like "Developers"
type GroupData = {
  project_key?: string
  translation_key?: string
  prefix?: string
  user_key?: string
}

type ProjectKey = {
  additional_origins?: string[]
  base_domain: string
  disable_ope: boolean
  deployment_method: string
  deployment_name: string
  is_active: boolean
  is_frozen: boolean
  is_glnow_enabled: boolean
  is_onelinktoken_validated: boolean
  is_pci: boolean
  is_referer_validated: boolean
  is_translation_disabled: boolean
  created_user: string
  created_utc: string
  groups?: Group[] // Included with details=1
  lastmod_user: string
  lastmod_utc: string
  origin_name: string
  project_config: string
  project_config_hash: string
  project_dbname: string
  project_key: string
  project_name: string
  project_status: string
  project_type: string
  quote_ticket: string
  root_domain: string
  skeleton_version?: number
  subscription_pay_key: string
  subscription_sku: string
  subscription_type: string
  subscription_status: 'active' | 'expired'
  subscription_value: number
  threshold_type: string
  threshold_value: number
  translations?: TranslationKey[]
  yy_translation_key: string
}

type LanguageCode = {
  abbyy_code: string
  aws_code: string
  google_code: string
  is_canonical: '1' | '0'
  langcode_code: string
  langcode_name: string
  language_iana_code: string
  language_iso2_code: string
  language_iso3_code: string
  language_name: string
  locale_code: string
  locale_name: string
  microsoft_code: string
  tesseract_code: string
  ty_code: string
}

type User = {
  user_key: string
  project_keys?: ProjectKey[]
  avatar_url?: string
  email?: string
  first_name?: string
  last_name?: string
  can_create_group?: boolean
  can_create_project?: boolean
  company_name?: string
  group_key?: string
  is_active?: boolean
  lastmod_user?: string
  lastmod_utc?: string
  phone?: string
  ui_view?: string
  user_type?: string
  [key: string]: any
}

type ProjectConfig = {
  translations?: TranslationConfig[]
  project_key?: string
  project_name?: string
  origin_name?: string
  deployment_method?: string
  deployment_name?: string
  disable_ope?: number
  [key: string]: any
}

type SegmentContentData = {
  is_staging: number
  pm_status_code?: string
  segment_hash: string
  status_code: string | undefined
  source: Jliff[]
  target: Jliff[]
  translation_source: string
}

type ContentPage = {
  content_url: string
  content_url_full: string
  content_url_hash: string
  context_url: string
  created_utc: string
  http_domain: string
  http_protocol: string
  http_status: number
  initial_page_usecs: string
  is_in_sitemap: boolean
  lastmod_utc: string
  my_num_words: number
  num_assets: number
  num_descendants: number
  num_images: number
  num_nonimages: number
  num_requests: number
  num_scrolls: number
  num_seo_warnings: number
  num_widgets: number
  page_blocks_total: number
  performance_grade: number
  performance_grade_detail: string
  pretranslate_bloat: number
  pretranslate_blocks_total: number
  pretranslate_blocks_used: number
  pretranslate_bytes: number
  pretranslate_cache_hit: number
  pretranslate_network_usecs: number
  pretranslate_utilization: number
  relaxation_time_msecs: number
  source_words: number
  target_lang_code: string
  translate_apply_usecs: number
  translate_bytes: number
  translate_network_usecs: number
  translate_num_calls: number
}

type RevisionItem = {
  avatar_url: string
  config_encoded: string
  config_hash: string
  email: string
  first_name: string
  last_name: string
  lastmod_user: string
  lastmod_utc: string
  revision_hash: string
  revision_label: string
}

type ContentPageAPIResponse = {
  pages: ContentPage[]
  rows_filtered: number
  rows_returned: number
  rows_total: number
}

type SegmentAPIResponse = {
  num_segments: number
  num_words: number
  rows_filtered: number
  rows_returned: number
  rows_total: number
  segments: Segment[]
  staging_segments: Segment[]
}

type BlockData = {
  block_hash: string
  source: Jliff[]
}

type SegmentContentResponse = {
  segments: Segment[]
  failed: string[]
  message?: string
}

type PreviewBlock = {
  source: Jliff[]
  block_hash: string
  suppress_mt: boolean
  suppress_cache: boolean
}
type PreviewSegment = {
  segment_hash: string
  target?: Jliff[] | null
  is_staging?: number
}
type PreviewData = {
  blocks: PreviewBlock[]
  segments: PreviewSegment[]
}
type PreviewResponseData = {
  [hash: string]: Jliff[]
}

type GlossaryRule = 'never_translate_as' | 'never_translate' | 'translate_as'
type GlossaryItem = {
  comment: string
  count?: number
  created_user: string
  created_utc: string
  is_case_sensitive: boolean
  is_mt: boolean
  lastmod_user: string
  lastmod_utc: string
  rule: GlossaryRule
  source_text: string
  source_text_hash: string
  target_text: string[]
  translation_key: string
  translation_source: string
}

type GlossaryAPIResponse = {
  glossary_items: GlossaryItem[]
  rows_filtered: number
  rows_returned: number
  rows_total: number
}

type GlossaryPOSTData = {
  created: number
  glossary_items: GlossaryItem[]
  message: string
  rows_filtered: number
  rows_returned: number
  rows_total: number
  updated: number
}
type GlossaryAPIPayload = {
  rule: GlossaryRule
  source_text: string
  translation_source?: string
  comment?: string
  is_case_sensitive?: boolean
  is_mt?: boolean
  target_text?: string[] | string
}

type SegmentTranslationDeleteResponse = {
  status: number
  data: string
}

type XapisErrorResponse = {
  message?: string // Ex. "message": "invalid linked_translation_key: 1C9F-4F28-EAB2-12FD"
}
