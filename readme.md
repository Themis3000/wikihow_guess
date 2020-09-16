# Wikihow guessing game
Game can be played at https://themis3000.github.io/wikihow_guess. Currently not mobile friendly, may be in the future.

#### Oh yeah, I've heard so that game before!
Is exactly what my friend told me as soon as I started explaining the game. Well I never heard of it, I thought I finally
came up with an original idea :(. Comparing the 2 this is a little different though, and in my definitely unbiased opinion
maybe even a little better. Ok, maybe not better in the site layout but better in the gamification. You can play the already
existing version here if you wish: [damn.dog](https://damn.dog/)

#### rules:
* Guess the correct article name to go with the provided image
* Every time you guess an incorrect name you will lose a life
* Use the "hint" button to get another image from the article to help your guess, you may only use 4 hints per game
* The game ends when you either run out of hearts or the timer runs out of time

My high score is 5 and the highest score I've seen someone get was 13 by "clean hands", see if you can beat it.

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

![Tracking image](https://imgtraker.herokuapp.com/img/L5kv9YzK.jpeg)
