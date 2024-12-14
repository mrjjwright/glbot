Overall Project Theme:

Massively improve the spidering, quoting, and batching process through the use of a local spider, streamlined and intuitive interface, and integrating as far as possible with TransQuote.

General Principles:

Segments only go into xapis when we are confident they ought to be translated.
Flexible configs that can be tweaked locally generate a "shopping cart" of segments that can be whittled down as desired before being submitted as a batch
Pending Batches are segregated from in-progress batches
Support for ad-hoc/routine local spiders, scripted "in-context" spiders (AMI), and routine scheduled farm machine spiders.
Notes from Meeting 11/25/2024
Responsibilities/Permissions
Usually the same OLE will manage spiders for all tkeys in a project
A batch is usually given an "Owner" - typically a PM
Could have multiple PMs in a single project
This is primarily for PD but could obviously be useful in GLWeb UI
Unlinked Configs
Not common, but essential
Scope is the main reason
E.g., a site has an /en-fr subfolder and only the English from that /en-fr pages gets translated into Frnech
Could also include tokenization/segmentation rule differences between different languages
e.g., /sp-us uses US dates, times, weights & measures, etc.
Spider needs
would be great if there could be a dif/history/change log for the config and apply desired changes to the project config
OLEs will in general prefer to run locally
NEED: a way to run the spider locally but passively, e.g., schedule it to run at midnight but not through the spider farm.
Notes from Meeting 11/18/2024
we demo'd batches and how it works
annie was worried about updating the GLTM with noleverage subs, we should make sure we do that on the right phase change
batch creation begins as a spider, then clean up in the UI with filters like UTIC, segment tags (e.g. garbage, huge)
segmentation etc is also done in the UI
tokenization is checked in UI
spider steps:
start with scope, whole site, url list, unspiderable sites needing scripted clickthrough via AMI
segments reviewed after a spider. initial sites are spidered with default config and then segments are reviewed in text view any tokenization/segmentation parameters, and on-page scoping, then spider is re-run
removing segments which shouldn't be translated
pre-production steps:
starts when the batch is in PD
it's analyzed in PD, and fuzzies etc. are calculated
further overheads are added via TransQuote (such as engineering time, test time, etc.)
separately delivered list of URLs (currently pulled from batch view in oljs.ui)
price per word by language varies significantly, currently added to the TransQuote by the IM
fuzzies are standard, fuzzy percentages are standard
hourly rates for service are also varied and by type added to TransQuote by the IM
straight to prod, Ie., no Quote, just billed on actuals after the fact
multiple spiders a day
no trans quote
auto-kick-off
Q&A
do you want any data on the raw data --> final leveraged segment count ?
potential cost-saving KPI, on a batch-level or on the metrics tab
people wanted to see in metrics tab, total raw words and leveraged words by language
Omar on content-collection: UPS is a metric for what's available on proxy
40 languages by 140 locales,
scope is different for each language
production spider for whole scope
priority spiders for select scope
AMI for the rest of the site
Leah, for unspiderable sites: we rely on AMI content from actual users
Anna, there's offline HTML with content for pre-translation
There's the ability to pre-translate /TX feeds
email edge-cases need further discussion
