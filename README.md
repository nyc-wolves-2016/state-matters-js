# state-matters-js

##Contributors:
* [Jack Feely](https://github.com/jackfeely)
* [Austin Lanari](https://github.com/foggy1) (Project Lead)
* [Jonathan Marchand](https://github.com/jmarsh433)
* [Soren Zeliger](https://github.com/soreasy)


If you put **any** barriers between the average person and political information, they generally won't try to cross them.  And who can blame them?  People are busy: as Locke aptly pointed out hundreds of years ago, the main reason we need government is because it would be incredibly inconvenient to oversee the contents of both our private lives and all public affairs.  That's the beauty of a representative democracy.

But if a person wants to be an informed voter, it shouldn't be so hard.

State Matters is a React.js project built in Node.js that allows NY residents to input their address, learn who their state senator is, and immediately see how that senator has been voting on the year's most contentious bills to date.  Users can also see what kinds of bills their representative has been sponsoring, the status of those bills, and all of this can be filtered by key words that interest the voter.

State Matters uses NY's [Open Legislation API](https://github.com/nysenate/OpenLegislation), Google's [Civic Information API](https://developers.google.com/civic-information/), and utlizes libraries like [Fullpage.js](https://github.com/alvarotrigo/fullPage.js/) and Materialize for its style and feel.

##Known Issues
* When entering a new address while on a different year from 2016, the new Senator's info for 2016 appears under the banner of the previously selected year.

##Stretch Goals
* Include Assembly persons
* Notify users of upcoming elections
