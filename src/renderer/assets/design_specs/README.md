# OneLink JS specifications

## Config specifications

### The following files define the specifications for the translation_config

translation_config.json - All configuration parameters and their defaults  
translation_config_examples.json - All configuration parameters with random examples  
translation_config_help.json - Text descriptions of all configuration parameters
  
### The following files define the specifications for the target_config

target_config.json - All configuration parameters and their defaults  
target_config_examples.json - All configuration parameters with random examples  
target_config_help.json - Text descriptions of all configuration parameters
  
### The following files define the specifications for the GLNOW glnow_config

glnow_config.json - All configuration parameters and their defaults  
glnow_config_examples.json - All configuration parameters with random examples  
glnow_config_help.json - Text descriptions of all configuration parameters

## DUTICX

When applying OneLink JS  configuration, such as excluding whole elements from translation, or tokenizing numbers, dates, order numbers, and other text, it is necessary to identify which urls and DOM elements to which the configuration applies.   DUTICX is a flexible mechanism for this purpose, and as seen in `translation_config_examples.json`, is accepted for most config properties.

DUTICX stands for:

- **D**, the domain, a regular expression that identifies one or more domains to which to apply the configuration rule. Comparison is made to the document.location.host. 
- **U**, the URL, a regular expression that identifies one or more urls to which to apply the configuration rule. Comparison is made to the document.location.pathname + document.location.search. 
- **T**, a regular expression for the tag, e.g. `div` or `span`, to which to apply the configuration rule. 
- **I**, a regular expresssion for the DOM id, the id attribute to which to apply the configuration rule. 
- **C**, a regular expresion for the class, to which to apply the configuration rule. 
- **X**, a valid CSS selector string (does not support regular expressions), to which to apply the configuration rule.   E.g. `#header div.dropdown`.   This gives the full power of CSS to customize OneLink JS configuration. To identify elements within a shadowRoot or IFRAME, you can use the '>>>' syntax. For example, '.mainclass>>>div' would find any elements identified by 'mainclass' and if they have a shadowRoot or contentDocument, it would then find all 'div' objects inside.

*Please note the following important rule: when identifying an element, the configuration should supply EITHER some combination of **TIC** values OR an **X** CSS selector but NOT both.  If both TIC and X values are used to identify elements for the configuration, **the X CSS selector will take precedence and the TIC values ignored**.   In such a case there will be a console warning in the browser.* 

Currently the X in DUTICX is valid for any rule that formerly took DUTIC except `no_ami`.

Again, for examples see, `translation_config_examples.json`.
  
  
### XAPIS Database

The JSON translation_config and target_config are stored as hex encoded strings in the XAPIS database in the XAPIS_PROJECT_TRANSLATION table  
They can be accessed through the /xapis/ProjectTranslation API  
The JSON glnow_config is stored as hex encoded strings in the XAPIS database in the XAPIS_PROJECT table  
It can be accessed through the /xapis/Project API

## Spider Design Work Flow

spider_design.txt - Spider work flow for XAPIS, AWS, Tarantula and S3.

## Reference URLs

The specifications are available at the following URLs  
  
https://api.onelink-preview.com/translation_config.json  
https://api.onelink-preview.com/translation_config_examples.json  
https://api.onelink-preview.com/translation_config_help.json  
  
https://api.onelink-preview.com/target_config.json  
https://api.onelink-preview.com/target_config_examples.json  
https://api.onelink-preview.com/target_config_help.json  
  
https://api.onelink-preview.com/glnow_config.json  
https://api.onelink-preview.com/glnow_config_examples.json  
https://api.onelink-preview.com/glnow_config_help.json  
  
https://api.onelink-preview.com/spider_design.txt

