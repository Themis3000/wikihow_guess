# Wikihow guessing game
Well, not yet. Right now it's just a wikihow webscraper. Soon to be a proper game that runs right in your browser though.
It's inspired by the googlefeud game, except where you are given an image or set of images and you must guess the article
name from a selection for points.

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