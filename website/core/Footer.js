/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
    docUrl(doc, language) {
        const baseUrl = this.props.config.baseUrl;
        return baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
    }

    pageUrl(doc, language) {
        const baseUrl = this.props.config.baseUrl;
        return baseUrl + (language ? language + '/' : '') + doc;
    }

    render() {
        const currentYear = new Date().getFullYear();
        return (
            <footer className="nav-footer" id="footer">
                <section className="sitemap">
                    <a href={this.props.config.baseUrl} className="nav-home">
                        {this.props.config.footerIcon && (
                            <img
                                src={this.props.config.baseUrl + this.props.config.footerIcon}
                                alt={this.props.config.title}
                                width="66"
                            />
                        )}
                    </a>
                    <div>
                        <h5>Documetation</h5>
                        <a href={this.docUrl('doc_overview.html', this.props.language)}>
                            Overview
                        </a>

                    </div>
                    <div>
                        <h5>Community</h5>
                        <a
                            href="http://stackoverflow.com/questions/tagged/hhuOS"
                            target="_blank">
                            Stack Overflow
                        </a>
                        <a href="http://hhuos.slack.com/">Project Chat on Slack</a>
                    </div>
                    <div>
                        <h5>More</h5>
                        <a href={this.props.config.baseUrl + 'blog'}>Blog</a>
                        <a href={this.props.config.repoUrl}>GitHub</a>
                        <a href={this.pageUrl("developers.html")}>Team Members</a>
                    </div>
                </section>
                <section className="copyright">
                    {this.props.config.copyright}
                </section>
            </footer>
        );
    }
}

// TODO add code documentation to docs folder
module.exports = Footer;
