/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock;
/* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
    return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
    return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
    return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Feature extends React.Component {
    render() {
        return (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '18px 0px'}}
                 className="pluginWrapper">
                <div>
                    <h2>{this.props.title}</h2>
                    <p>{this.props.content}</p>
                </div>
                <div>
                    <img src={this.props.image}/>
                </div>
            </div>
        );
    }
}


class Button extends React.Component {
    render() {
        return (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={this.props.href} target={this.props.target}>
                    {this.props.children}
                </a>
            </div>
        );
    }
}

Button.defaultProps = {
    target: '_self',
};

const SplashContainer = props => (
    <div className="homeContainer">
        <div className="homeSplashFade">
            <div className="wrapper homeWrapper">{props.children}</div>
        </div>
    </div>
);

const Logo = props => (
    <div className="projectLogo">
        <img src={props.img_src}/>
    </div>
);

const ProjectTitle = props => (
    <h2 className="projectTitle">
        {siteConfig.tagline}
    </h2>
);

const PromoSection = props => (
    <div className="section promoSection">
        <div className="promoRow">
            <div className="pluginRowBlock">{props.children}</div>
        </div>
    </div>
);

class HomeSplash extends React.Component {
    render() {
        let language = this.props.language || '';
        return (
            <SplashContainer>
                <img width='30%' src={imgUrl('logo_v2.svg')}/>
                <div className="inner">
                    <ProjectTitle/>
                    <PromoSection>
                        <Button href={docUrl('doc_overview.html')}>Documentation</Button>
                        <Button href={pageUrl('osguide.html')}>Video Guide</Button>
                        <Button href={siteConfig.repoUrl}>Contribute on Github</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }

    // TODO add Codedocumentation as Button to PromoSection
}

const Block = props => (
    <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout}/>
    </Container>
);

const Description = props => (
    <Block>
        {[
            {
                content: 'hhuOS is a small operating system written in C++ and Assembler for x86-architectures. It is being developed by a group of students at the Heinrich-Heine University in Düsseldorf.',
                image: imgUrl('screenshots/bootscreen.png'),
                imageAlign: 'bottom',
                title: 'Description',
            },
        ]}
    </Block>
);

const Features = props => (
    <Container>
        <Feature title="Paging" content="Paging is used to abstract from physical memory. This allows hhuOS to use a Higher half kernel. It is also possible to create an arbitrary number of virtual address spaces, which will be used in the future, to launch processes with independent adress spaces. For further reference" image={imgUrl('paging_logo.svg')}/>
        <Feature title="Kernel Module Loader" content="It is possible to extend hhuOS with kernel modules. These modules are loaded by the filesystem and linked agains the kernel at runtime. This makes it possible to keep the kernel minimalistic while offering features, when they are needed." image={imgUrl('module_loader.png')}/>
        <Feature title="Menu" content="After the system has booted succesfully, the user is greeted by graphical menu with demo applications." image={imgUrl('screenshots/menu.png')}/>
        <Feature title="Shell" content="The os offers a simple unix-like Shell, allowing the user to interact with the filesystem." image={imgUrl('screenshots/shell.png')}/>
        <Feature title="Bluescreen" content="In case of a system crash, an informative bluescreen with a stacktrace and the cpu state is shown for debugging purposes." image={imgUrl('screenshots/bluescreen.png')}/>
    </Container>
);

const FeatureCallout = props => (
    <div
        className="productShowcaseSection paddingBottom">
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are a few features of this project</MarkdownBlock>
    </div>
);

class Index extends React.Component {
    render() {
        let language = this.props.language || '';

        return (
            <div>
                <HomeSplash language={language}/>
                <div className="mainContainer">
		    <Description/>
                    <FeatureCallout/>
                    <Features/>
                </div>
            </div>
        );
    }
}

module.exports = Index;

