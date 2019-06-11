/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
    title: 'hhuOS' /* title for your website */,
    tagline: 'hhuOS - A small operating system for learning purposes',
    url: 'https://hhuOS.github.io' /* your website url */,
    cleanUrl: true,
    baseUrl: '/' /* base url for your project */,
    projectName: 'hhuOS',
    headerLinks: [
        {doc: 'doc_overview', label: 'Documentation'},
        {page: 'osguide', label: 'Videos'},
        {doc: 'todos', label: "TODOs"},
        {blog: true, label: 'Blog'},
        {page: 'developers', label: 'Team'},
        {page: 'help', label: 'Help'},
    ],
	onPageNav: 'separate',
    /* path to images for header/footer */
    headerIcon: 'img/logo_v3_light.svg',
    footerIcon: 'img/logo_v3_dark.svg',
    favicon: 'img/favicon.ico',
    /* colors for website */
    colors: {
        primaryColor: '#006AB3',
        secondaryColor: '#D9DADB',
    },
    // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
    copyright:
    'Copyright © 2017-' +
    new Date().getFullYear() +
    ' Burak Akguel, Christian Gesse, Fabian Ruhland, Filip Krakowski, Michael Schoettner',
    organizationName: 'hhuOS', // or set an env variable ORGANIZATION_NAME
    projectName: 'hhuOS.github.io', // or set an env variable PROJECT_NAME
    highlight: {
		theme: 'atom-one-dark',
	},
	scripts: [
		'https://buttons.github.io/buttons.js',
		'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
		'/js/code-blocks-buttons.js',
	],
	stylesheets: ['/css/code-blocks-buttons.css'],
    // You may provide arbitrary config keys to be used as needed by your template.
    repoUrl: 'https://github.com/hhuos/hhuos',
    team: [
        {
            name: "Burak Akgül",
            type: "Developer",
            github: "https://github.com/bur-ak94",
            email: "b.akguel94@gmx.de"
        },
        {
            name: "Christian Gesse",
            type: "Developer",
            github: "https://github.com/chges100",
            email: "christian.gesse@hhu.de"
        },
        {
            name: "Fabian Ruhland",
            type: "Developer",
            github: "https://github.com/faruh100",
            email: "fabian.ruhland@hhu.de"
        },
        {
            name: "Filip Krakowski",
            type: "Developer",
            github: "https://github.com/filkra",
            email: "filip.krakowski@hhu.de"
        },
        {
            name: "Michael Schoettner",
            type: "Coordinator",
            github: "https://github.com/mschoett",
            email: "michael.schoettner@hhu.de"
        }
    ],
    contributor: [
        {
            name: "Thiemo Urselmann",
            topic: "Bachelor thesis: 'Development of an Ethernet software package for the Intel/PRO-1000 network adapter'",
            github: "https://github.com/Joker140"
        }
    ]
};


module.exports = siteConfig;

