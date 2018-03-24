/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
    title: 'hhuOS' /* title for your website */,
    tagline: 'A website for hhuOS2',
    url: 'https://hhuOS.github.io' /* your website url */,
    baseUrl: '/' /* base url for your project */,
    projectName: 'hhuOS',
    headerLinks: [
        {doc: 'doc_overview', label: 'Docs'},
        /*TODO: Add code doc to header link*/
        {doc: 'TODOs', label: "ToDo's"},
        {page: 'help', label: 'Help'},
        {blog: true, label: 'Blog'},
    ],
    /* path to images for header/footer */
    headerIcon: 'img/logo.png',
    footerIcon: 'img/logo.png',
    favicon: 'img/boot_logo.svg',
    /* colors for website */
    colors: {
        primaryColor: '#001234',
        secondaryColor: '#003366',
    },
    // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
    copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Burak Akguel, Christian Gesse, Fabian Ruhland, Filip Krakowski, Michael Schoettner',
    organizationName: 'hhuOS', // or set an env variable ORGANIZATION_NAME
    projectName: 'hhuOS.github.io', // or set an env variable PROJECT_NAME
    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks
        theme: 'default',
    },
    scripts: ['https://buttons.github.io/buttons.js'],
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
    contributor: ""
};


module.exports = siteConfig;
