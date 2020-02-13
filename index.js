// 'use strict';

const prompts = require('./prompts');
const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const puppeteer = require('puppeteer');
const path = require('path');



promptUser().then(res => {
    
    const {
        public_repos,
        followers,
        following,
        name,
        blog,
        location,
        bio,
        avatar_url,
        html_url
    } = res[0].data;
    const githubStars = res[1].data.length;
    const profileColor = res[2];

    const responseObj = {
        public_repos: public_repos,
        followers: followers,
        following: following,
        name: name,
        blog: blog,
        location: location,
        bio: bio,
        avatar_url: avatar_url,
        githubStars: githubStars,
        html_url: html_url,
        color: profileColor
    }
    console.log(res);
    generateHTML(responseObj);

});



async function promptUser() {
    let githubInfo;
    try {
        const { github, color } = await inquirer.prompt(prompts);
        const queryUrl = `https://api.github.com/users/${github}`;
        const starredQueryUrl = `${queryUrl}/starred`
        githubInfo = await getGithubInfo(queryUrl, starredQueryUrl);
        githubInfo.push(color);
     
    }
    catch (err) { console.log(err); }

    return githubInfo;

}
//made two promies run async doubling execution time of retriving information
async function getGithubInfo(profileUrl, starredRepoUrl) {
    let UserProfileInfo = [];
    try {
        const githubProfile = axios.get(profileUrl);
        const starredRepos = axios.get(starredRepoUrl);
        UserProfileInfo = await Promise.all([githubProfile, starredRepos]);
    }
    catch (err) { console.log(err); }

    return UserProfileInfo;

}



async function generateHTML(response) {
    try {
        let bulmaColor1 = "";
        let bumlaColor2 = "";
        switch (response.color) {
            case 'Green':
                bulmaColor1 = "is-success";
                bumlaColor2 = "has-background-success";
                break;
            case 'Blue':
                bulmaColor1 = "is-link";
                bumlaColor2 = "has-background-link";
                break;
            case 'Red':
                bulmaColor1 = "is-danger";
                bumlaColor2 = "has-background-danger";
                break;
            case 'Yellow':
                bulmaColor1 = "is-warning";
                bumlaColor2 = "has-background-warning";
                break;
            case 'Spring Green':
                bulmaColor1 = "is-primary";
                bumlaColor2 = "has-background-primary";
                break;
            case 'Azure':
                bulmaColor1 = "is-info";
                bumlaColor2 = "has-background-info";
                break;
            default:
                bulmaColor1 = "is-primary";
                bumlaColor2 = "has-background-primary";
        }

        const html = `
        <!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Developer!</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    <link rel="stylesheet" href="./style/style.css">
    <!-- <link rel="stylesheet" href="style/debug.css"> -->
</head>

<body>
    <section class="section hero ${bulmaColor1} is-small">
        <div class="hero-body">
            <article class="media">

                <div class='column is-12 has-text-centered'>
                    <div class='card equal-height'>
                        <div class='card-content'>
                            <!-- Place image inside .level within your card element -->
                            <nav class="level">
                                <div class="level-item has-text-centered">
                                    <figure class='image is-128x128'><img class = "is-rounded"
                                            src='https://avatars0.githubusercontent.com/u/46702267?v=4'></figure>
                                </div>
                            </nav>
                            <nav class="level">
                                    <div class="level-item has-text-centered">
                                      <h1>Hi!</h1>
                                    </div>
                                </nav>
                                <nav class="level">
                                        <div class="level-item has-text-centered">
                                          <h2>My name is ${response.name}!</h2>
                                        </div>
                                    </nav>
                                    <nav class="level">
                                            <div class="level-item has-text-centered">
                                              <h3>${response.bio}</h3>
                                            </div>
                                        </nav>
                            <nav class="level is-mobile">
                  
                                    <div class="level-item">
                                        <a class="level-item">
                                            <span class="icon "><i class="fas fa-location-arrow"></i>${response.location}</span>
                                        </a>
                                        <a class="level-item">
                                            <span class="icon "><i class="fab fa-github-alt"></i>${response.html_url}</span>
                                        </a>
                                        <a class="level-item">
                                            <span class="icon "><i class="fas fa-rss"></i>${response.blog}</span>
                                        </a>
                                    </div>
                                </nav>
                            <!-- And it'll be centered like so -->
                        </div>
                    </div>
                </div>
                
        </div>
       
        </article>
        </div>


    </section>
    <section class="section">
        <div class="container row-1">
            <div class="columns  is-variable is-6">
                <div class="column  is-2">
                </div>
                <div class="column notification ${bulmaColor1} is-3">
                    Public Repositories: ${response.public_repos}
                </div>
                <div class="column is-1">
                </div>

                <div class="column notification ${bulmaColor1} is-3">
                    Followers: ${response.followers}
                </div>
                <div class="column is-2">

                </div>
            </div>
        </div>
        <div class="container row-2">
            <div class="columns is-variable is-6">
                <div class="column is-2">
                </div>
                <div class="column notification ${bulmaColor1} is-3">
                    GitHub Stars: ${response.githubStars}
                </div>
                <div class="column is-1">
                </div>

                <div class="column notification ${bulmaColor1} is-3">
                    Following: ${response.following}
                </div>
                <div class="column is-2">
                </div>
            </div>
        </div>

        </div>


    </section>
    <section class="section ${bumlaColor2}">
        <footer class="footer  ${bumlaColor2} ">
            <div class="content has-text-centered">
               
            </div>
        </footer>
    </section>
</body>

</html>`;

        await writeFileAsync('index.html', html);
        await printPDF();
    } catch (err) { console.log(err); }
}



async function printPDF() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(__dirname, "index.html")}`, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    await writeFileAsync('test.pdf', pdf, 'binary');

    await browser.close();
    return pdf;
}
