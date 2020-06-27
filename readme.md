# Wikihow guessing game
Front end is in a pretty crappy, hopefully temporary state right now, but it can be viewed and played at
https://themis3000.github.io/wikihow_guess.

##### rules:
* Guess the correct article name to go with the provided image
* Every time you guess an incorrect name you will lose a life
* Use the "hint" button to get another image from the article to help your guess, you may only use 4 hints per game
* The game ends when you either run out of hearts or the timer runs out of time

My high score is 5 and the highest score I've seen someone get was 12 by @Beaux44, see if you can beat it.

### Wait, so why are you web scraping?
Yes, I know this seems like a bad way of doing it, especially sense there's a url (https://www.wikihow.com/Special:Randomizer)
that just returns a random article. But that being said, I want this project to be backendless (well, meaning a static backend)
so I can just use github's free static host so I never have to think about the hosting of this at all. Yes, it would
be way easier to just write a little python http backend, but part of this is making an excuse to learn python webscraping
too.

Then why don't you use an http request in browser to https://www.wikihow.com/Special:Randomizer??

Well, they don't have "Access-Control-Allow-Origin: *" in their response header, so the browser prevents the
code from ever seeing the response

it'd dumb, but could you make an iframe with no width or height to get the document object for the page?

Nope, not that either. They have "X-Frame-Options: SAMEORIGIN" in their response headers, which disallows pages from
being used in an iframe on any site but their own. From my quick research there's not really a way around this.
