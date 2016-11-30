#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Fabian Hirschmann'
SITENAME = "Fabian's Website"
SITEURL = ''

PATH = 'content'
STATIC_PATHS = ['images', 'extra', 'figure']
EXTRA_PATH_METADATA = {
        'extra/robots.txt': {'path': 'robots.txt'},
        'images/favicon.ico': {'path': 'favicon.ico'},
}
PLUGIN_PATHS = ['pelican-plugins', 'pelican-plugins2']
PLUGINS = ['pelican_javascript', 'render_math', 'pelican-cite', 'pelican-knitr', 'sitemap']

PUBLICATIONS_SRC = 'content/bibliography.bib'

DISPLAY_PAGES_ON_MENU = True
DISPLAY_CATEGORIES_ON_MENU = False
HIDE_SIDEBAR = True

THEME = 'theme'
BOOTSTRAP_THEME = 'yeti'
PYGMENTS_STYLE = 'monokai'
DISPLAY_ARTICLE_INFO_ON_INDEX = False

TIMEZONE = 'Europe/Berlin'

DEFAULT_LANG = 'en'

GITHUB_URL = 'https://github.com/fhirschmann'
#GOOGLE_ANALYTICS = 'UA-30143340-1'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
FAVICON = "favicon.ico"

LINKS = ()

# Social widget
SOCIAL = (
        ('Github', 'https://github.com/fhirschmann'),
        ('Mail', 'mailto:fabian@hirschmann.email', 'pencil'),
        ('Facebook', 'http://www.facebook.com/fhirschmann'),
        ('LinkedIn', 'http://www.linkedin.com/in/fhirschmann'),
        ('Xing', 'https://www.xing.com/profile/Fabian_Hirschmann2'),
        ('BTC', 'bitcoin:16Mhwr5U9JVvVLEGwyPqyR1WE8qaJtzsin', 'bitcoin'),
)

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

DISQUS_SITENAME = "0x0b"

DEFAULT_PAGINATION = False
LOAD_CONTENT_CACHE = True
CACHE_CONTENT = True
CHECK_MODIFIED_METHOD = "md5"
#CONTENT_CACHING_LAYER = "generator"

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
