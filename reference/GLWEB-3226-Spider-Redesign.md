# GlobalLink Web - Spidering and Content Discovery Redesign

## Project Overview
Massively improve the spidering, quoting, and batching process with a focus on flexibility, efficiency, and user control.

## Key Principles

### 1. Intelligent Segment Selection
- Segments only enter translation workflow when confident they should be translated
- Flexible configuration options
- Create a "shopping cart" of segments that can be refined before batch submission

### 2. Spider Types and Modes
#### Spider Modes
- Local Spider (Passive/Active)
- Ad-hoc Local Spiders
- Scripted "In-Context" Spiders (AMI)
- Scheduled Farm Machine Spiders

### 3. Configuration Management
#### Unlinked Configs
- Support for granular scoping
- Examples:
  - Language-specific subfolder translations
  - Tokenization/segmentation rule variations
  - Locale-specific formatting differences

#### Config Tracking
- Diff/history/change log for configurations
- Ability to apply changes across project configs

## Spider Workflow

### Initial Spider Phase
1. Define Scope
   - Whole site
   - Specific URL list
   - Unspiderable sites (requiring AMI)

2. Initial Spider
   - Run with default configuration
   - Review segments in text view

3. Refinement
   - Adjust tokenization/segmentation parameters
   - Refine on-page scoping
   - Re-run spider, removing non-translatable segments

### Pre-Production Steps
1. Batch Analysis
   - Fuzzy match calculations
   - Overhead assessment via TransQuote
   - Language-specific pricing

2. Batch Creation
   - Filter capabilities (UTIC, segment tags)
   - Segment review and cleanup

## Advanced Features

### Metrics and Reporting
- Raw to leveraged segment count tracking
- Cost-saving KPIs
- Detailed metrics per batch and project

### Content Collection Strategies
- Support for multiple languages and locales
- Priority and comprehensive spider modes
- Fallback to AMI for complex sites

### Offline and Pre-translation Support
- Offline HTML content handling
- Translation feed integration

## Technical Considerations
- Passive local spider scheduling
- Flexible configuration management
- Comprehensive logging and tracking
- Seamless TransQuote integration

## Future Enhancements
- Automated quote generation
- Enhanced AMI content collection
- Improved edge case handling

## Open Questions
- Detailed UPS (Unique Page Scope) calculation method
- Specific AMI content collection strategies
- Handling of offline and pre-translation content
