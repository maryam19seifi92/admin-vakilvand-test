
// @ts-nocheck


export const localeCodes =  [
  "da",
  "de",
  "el",
  "en",
  "es",
  "fr",
  "hu",
  "it",
  "ja",
  "pl",
  "pt",
  "ru",
  "sv",
  "tr",
  "zh",
  "ae"
]

export const localeLoaders = {
  "da": [{ key: "../locales/da.json", load: () => import("../locales/da.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_da_json" */), cache: true }],
  "de": [{ key: "../locales/de.json", load: () => import("../locales/de.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_de_json" */), cache: true }],
  "el": [{ key: "../locales/fr.json", load: () => import("../locales/fr.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_fr_json" */), cache: true }],
  "en": [{ key: "../locales/en.json", load: () => import("../locales/en.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_en_json" */), cache: true }],
  "es": [{ key: "../locales/es.json", load: () => import("../locales/es.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_es_json" */), cache: true }],
  "fr": [{ key: "../locales/fr.json", load: () => import("../locales/fr.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_fr_json" */), cache: true }],
  "hu": [{ key: "../locales/hu.json", load: () => import("../locales/hu.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_hu_json" */), cache: true }],
  "it": [{ key: "../locales/it.json", load: () => import("../locales/it.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_it_json" */), cache: true }],
  "ja": [{ key: "../locales/ja.json", load: () => import("../locales/ja.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_ja_json" */), cache: true }],
  "pl": [{ key: "../locales/pl.json", load: () => import("../locales/pl.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_pl_json" */), cache: true }],
  "pt": [{ key: "../locales/pt.json", load: () => import("../locales/pt.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_pt_json" */), cache: true }],
  "ru": [{ key: "../locales/ru.json", load: () => import("../locales/ru.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_ru_json" */), cache: true }],
  "sv": [{ key: "../locales/sv.json", load: () => import("../locales/sv.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_sv_json" */), cache: true }],
  "tr": [{ key: "../locales/tr.json", load: () => import("../locales/tr.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_tr_json" */), cache: true }],
  "zh": [{ key: "../locales/zh.json", load: () => import("../locales/zh.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_zh_json" */), cache: true }],
  "ae": [{ key: "../locales/ae.json", load: () => import("../locales/ae.json" /* webpackChunkName: "locale__home_maryam_Desktop_dastyar_front_locales_ae_json" */), cache: true }]
}

export const vueI18nConfigs = [
  () => import("../i18n.config.ts?hash=bffaebcb&config=1" /* webpackChunkName: "i18n_config_bffaebcb" */)
]

export const nuxtI18nOptions = {
  "experimental": {
    "localeDetector": "",
    "switchLocalePathLinkSSR": false,
    "autoImportTranslationFunctions": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false
  },
  "compilation": {
    "jit": true,
    "strictMessage": true,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "",
  "locales": [
    {
      "code": "da",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/da.json"
      ]
    },
    {
      "code": "de",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/de.json"
      ]
    },
    {
      "code": "el",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/fr.json"
      ]
    },
    {
      "code": "en",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/en.json"
      ]
    },
    {
      "code": "es",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/es.json"
      ]
    },
    {
      "code": "fr",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/fr.json"
      ]
    },
    {
      "code": "hu",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/hu.json"
      ]
    },
    {
      "code": "it",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/it.json"
      ]
    },
    {
      "code": "ja",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/ja.json"
      ]
    },
    {
      "code": "pl",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/pl.json"
      ]
    },
    {
      "code": "pt",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/pt.json"
      ]
    },
    {
      "code": "ru",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/ru.json"
      ]
    },
    {
      "code": "sv",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/sv.json"
      ]
    },
    {
      "code": "tr",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/tr.json"
      ]
    },
    {
      "code": "zh",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/zh.json"
      ]
    },
    {
      "code": "ae",
      "files": [
        "/home/maryam/Desktop/dastyar-front/locales/ae.json"
      ]
    }
  ],
  "defaultLocale": "en",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": false,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "no_prefix",
  "lazy": true,
  "langDir": "locales/",
  "detectBrowserLanguage": {
    "alwaysRedirect": false,
    "cookieCrossOrigin": false,
    "cookieDomain": null,
    "cookieKey": "i18n_redirected",
    "cookieSecure": false,
    "fallbackLocale": "",
    "redirectOn": "root",
    "useCookie": true
  },
  "differentDomains": false,
  "baseUrl": "",
  "dynamicRouteParams": false,
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false,
  "multiDomainLocales": false,
  "i18nModules": []
}

export const normalizedLocales = [
  {
    "code": "da",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/da.json"
      }
    ]
  },
  {
    "code": "de",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/de.json"
      }
    ]
  },
  {
    "code": "el",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/fr.json"
      }
    ]
  },
  {
    "code": "en",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/en.json"
      }
    ]
  },
  {
    "code": "es",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/es.json"
      }
    ]
  },
  {
    "code": "fr",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/fr.json"
      }
    ]
  },
  {
    "code": "hu",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/hu.json"
      }
    ]
  },
  {
    "code": "it",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/it.json"
      }
    ]
  },
  {
    "code": "ja",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/ja.json"
      }
    ]
  },
  {
    "code": "pl",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/pl.json"
      }
    ]
  },
  {
    "code": "pt",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/pt.json"
      }
    ]
  },
  {
    "code": "ru",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/ru.json"
      }
    ]
  },
  {
    "code": "sv",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/sv.json"
      }
    ]
  },
  {
    "code": "tr",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/tr.json"
      }
    ]
  },
  {
    "code": "zh",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/zh.json"
      }
    ]
  },
  {
    "code": "ae",
    "files": [
      {
        "path": "/home/maryam/Desktop/dastyar-front/locales/ae.json"
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false

export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18n"
export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
