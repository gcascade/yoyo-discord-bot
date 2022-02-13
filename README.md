# yoyo-discord-bot

## Requirements

* Install [Node.js](https://nodejs.org/en/) 

  > discord.js v13 requires Node 16.6 or higher
* Create a Discord bot [here](https://discord.com/developers/applications)
* Add the bot to your server and set its permissions

  > Permissions may be required for some commands
* On Windows, you may need to install [2015 Visual Studio Build Tools](https://www.microsoft.com/en-us/download/details.aspx?id=48159) to use sodium, the following command might also help:

  `npm install --global --production --vs2015 --add-python-to-path windows-build-tools`

  > Installing Visual Studio 2015 seems to be the easiest solution. C++ programming language and "Tools and Windows SDK" for Windows 8.1 and UCRT SDK need to be checked when installed Visual Studio.
  >
  > In Windows environment variables, add VCTargetsPath and set it to C:\Program Files (x86)\MSBuild\Microsoft.cpp\v4.0\v140
  >
  > Then run `npm config set msvs_version 2015`


## Install the project

* open a terminal and run `npm install`
* copy the file `.env.example` and rename it as `.env`
* Set the following values:

| Value | Description | Required | Example |
|----|----|----|----|
| TOKEN_ID | from [here](https://discord.com/developers/applications), go to Your Application > Bot > Token | __yes__ | OTM4MTI3NTUzNzc0OTExNTI4.YflxXg.5Z7UuQgWWiFQvYei-qqHjHx24pI|
| ROLE_ID | A role used for certain commands, see [this](https://discordhelp.net/role-id) | __yes__ | 437254279452164096 |
| DEFAULT_WIKI_LANG | Default language for wiki search engine | no | de, **en**, es, fr, it |

## Start the bot

* open a terminal and run `npm run dev`
