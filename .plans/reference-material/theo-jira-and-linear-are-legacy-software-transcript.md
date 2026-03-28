# Transcript: Jira and Linear are legacy software

- Source URL: https://youtu.be/pzUn9wTCgcw
- Retrieved via: Docker MCP `get_transcript`
- Title returned by tool: `Jira and Linear are legacy software - YouTube`

## Transcript

If you're anything like me, you probably
hate issue trackers, which is why it's
so exciting to see them die. That said,
I'm a little scared of what's next. I
need to address something really quick,
though. You might have thought the
thumbnail was clickbait. I know I use
fake tweets sometimes to get your guys'
attention. This time, it wasn't. Even
Linear is saying that issue tracking is
dead. Kind of crazy that they are trying
to kill the industry category that they
have been leading for a while. But I'm
actually really excited about the
direction that they're going in. They
just posted an article all about this
and I couldn't agree more. It seems like
the future of development is not a pile
of issues on Jira and Linear that you
slowly go through as a team and instead
it's going to look and feel a lot
different. It's really hard to say what
the future's going to look like, but I'm
excited to explore what Linear is
working on. But there is something I
know is useful right now. Today's
sponsor. Two years ago, I had a
conversation that has stuck with me
since. It was a conversation with
Garmmo, the CEO of Verscell. We were
talking about things that we did right
and wrong with our businesses. And a
thing that he said that shocked me is
that he deeply regrets rolling his own O
at Verscell. That might sound insane
with a company the size of Verscell.
Like obviously you should be rolling
your own everything is your platform,
right? Well, it turns out there's a lot
of problems when you own your O layer
and they're not things like setting up
Google to sign incorrectly. As annoying
as that is, problems go deeper. What
happens when real companies want to
onboard onto your product and they don't
have the weird niche expectations their
IT team expects to make it so their
business employees can sign into your
service using their existing
authentication. Spoiler, I'm not the
only one GMO's had this conversation
with. And as he says here, I think we
could have done even more business if we
had partnered with Work OS earlier. It's
been incredibly wellreceived. I'm sure
you've guessed by now, but today's
sponsor is Work OS, the O platform used
by OpenAI, Anthropic, Verscell, T3 Chat,
and many, many more. Works has found an
incredible balance of developer
experience and enterprise readiness
where they have everything you need to
onboard these real companies. Never
having to think about identity provision
again is a gift from the heavens. And I
am so thankful for work OS making it so
that I never have to configure ADP again
for the rest of my life. If that's all
they offered, it would be worth it. But
there's so much more to the platform.
Okit makes it really easy to set up the
buttons and panels that you need for
your users. MCP off means you can
finally add authorization to your MCP
servers. Directory sync makes it trivial
for companies to keep things in sync
between their dashboards and your
product. Well, it's one of the best ways
to store user specific encrypted values,
things like API keys that they might be
using in your service. And there's so
much more to explore. Your next fear is
probably going to be the price cuz
there's no way it can be that good for
cheap, right? Well, you have nothing to
worry about cuz the first million users
are free. Get yourself enterprise ready
at soyv.link/workos.
I'm very excited to read into what
Linear is cooking here. You know they're
cooking something different because this
is the only not dark mode page I've ever
seen linear ship. They actually took the
time to make it so when you read this
particular page, it is light mode and
they flip the logo and everything in the
topnav. They also did the usual linear
thing of trying way too hard in design
for something that doesn't matter that
much with the logo. You can move your
cursor through like a fluid and click to
pulse it. It's cool. It's very uh linear
of them. Anyways, issue tracking is
dead. It was built for a handoff model
of software development. A PM would
scope the work. Engineers would pick it
up later and the system was filled with
prioritization, negotiation, and
workflows to bridge the gap. That
ceremony came from real constraints.
Engineering time was scarce. Teams
needed a way to route work carefully
across roles and functions. Absolutely
agree. This was my whole life when I was
an engineer back at Twitch. was the
chaos of breaking up large piles of work
into small tickets, throwing those into
a queue, and then going through them,
assigning them to people, and trying to
guesstimate when all of the work
necessary would be done to ship the
thing they all lean into. But over time,
complexity started to look like
sophistication. The more process a
system could absorb, the more advanced
it seemed. Overhead kept growing, and
the process became work itself. Yep, my
Jira dashboard back at Twitch would take
over 2 minutes to load. Technically
saying that is against the terms of
service for Jira, but thankfully I have
been out of Twitch for over five years
now, so I can say whatever the [ __ ] I
want. Yeah, Jira ran like [ __ ]
garbage. And that was because we had
filled it with so much complex [ __ ]
across the absurd number of tickets in
different fields and data links across
things at Twitch. And that's just what
happens when you have a system like
this. Every single feature is going to
be used and abused until it breaks at
the seams. People are confused about why
I can't talk about Jira's performance.
They did a terms of service update back
in the day when I was at Twitch that
explicitly banned talking about the
performance characteristics of Jira and
sharing benchmarks for its performance
when I was at Twitch. But now it's been
long enough that I will tell you guys
Jira performs like [ __ ] garbage at
real companies. Also, yes, I do have
Jira as a banned term on my Twitch
streams because I thought it was funny
to do. I might need to go remove that.
If one of the moderators can go figure
out how to do that, please do. At least
for now. Yeah, Jira, the correct
spelling with the star. We need to not
say the J word if we can avoid it. Back
to the article. Linear has always been
built on the opposite belief, the
opposite of the system continuing to
grow and get more complex. The best
systems should remove overhead so the
teams can focus on building. That's
absolutely how Linear felt. It felt like
they were trying to remove as much
weight as possible. So getting in,
looking at the issues, filtering through
things, and getting the data you need to
go back to work was as easy as possible.
And that's why so many engineers
preferred linear. It was kind of a bet
on engineers being the ones who made
important decisions at companies because
Jira was the thing that product managers
picked because that's what it was
marketed to to be clear. And linear
wanted something the engineers like cuz
they hated using Jira at the companies
they were at. So they made linear to
make something nice and simple and
elegant for engines. And it more than
succeeded and is now doing quite well. I
would bet they have a similar number of
users and a significantly higher number
of startups than Ajira ever has or will.
But now we're in the AI era and things
are changing fast. Again, their goal is
to remove overhead and according to
them, agents push the removal of that
overhead even further. They can make
software dev a lot simpler. Planning,
implementation, and code review begin to
compress as agents absorb more of the
procedural work. You can spend more time
on intent, judgment, and taste and less
time managing the mechanics of the
process. This one's particularly
interesting to me because I actually
kind of worked the same way when I was
at Twitch. It was so common to have
tickets that just didn't correctly
estimate how hard things were and missed
a bunch of subtasks that were important.
And to be frank, I never read a spec
that was written before the product was
made that even came close to describing
what the product actually would be, how
it should be implemented, and how long
it would take. It was almost always
entirely inaccurate. So what I did
instead is I would go build a small
version of what we were aiming for in 1
to 3 days just to force out whatever
could let us test the UX. And through
that process, I'd be able to identify
any technical shortcomings and things
that we have to touch. I'd have a very
clear surface area of things we have to
know about and be involved in in order
to make this work. I'd have a demoable
usable version of the product that we
could use for testing both internally
and in front of users when we brought
users into the office. And through that,
we were able to collect a ton of
information in order to make sure that
we steered the product and its design in
the right direction. The result of this
is that we could write way better specs
because we actually had a rough idea of
what the product would look like and how
it would work. The more surprising part
for me though was how often we would
just ship that quickly built version.
And to be very clear, the point of this
process wasn't to get the feature out
faster. It was to develop a working
prototype of it, to know what was
required to do it, and to make a better
spec. and most importantly have a
version that people could start testing
to make sure this is even worth doing.
And I would say about half the time we
ended up slightly polishing that first
pass and just shipping it because we had
no reason to go much further with it.
The amount of times I had a thing that
should have been a huge 20page spec that
we spent weeks writing and debating that
just took me a few days and we ended up
shipping as is hilarious. To be frank,
this hurt my career growth to an extent
because we didn't have all these fancy
documents we could point at during my
promotion process that was built all
around that [ __ ] But it did make me
pretty well regarded internally. And
this is still referred to as the Theo
method or the Theo prototype at Twitch
to this day, depending on the team, of
course, but a lot of teams still do
things this way. I know I fully
overhauled a handful of teams process
around product design by just refusing
to write a boring, useless spec. There's
nothing I hate more than useless
[ __ ] being done by engineers that
doesn't even make them feel good.
Engineers love useless [ __ ] as long
as it's inside of their terminal. They
hate it when it's inside of Google Docs.
So trying to get them away from those
things and instead back into their
editor was always beneficial. And it
turns out a lot of people agree. They
just weren't good enough devs to agree.
Okay, I shouldn't say good because this
is a different skill. There's a lot of
very talented devs that don't build very
fast and there's a lot of average devs
that happen to build really fast. That's
how I would have described myself when I
was at Twitch. I was a okay to decent
dev, but I was really good at trimming
the fat, identifying where in the system
we can insert the thing to make it way
easier to build and then building the
thing. That was one of the things that
made me unique. That's also a capability
that almost all engineers now have
because of agents. Benefits and
negatives. That said, I think that way
of building is so much better. Make a
first version of the thing, then make
the spec, then build it correctly,
rather than write a spec, assuming you
know how it will work, build it wrong
because you were incorrect with the
spec, and then keep [ __ ] throwing
band-aids on it until it kind of works,
and then you ship a broken thing. Hate
that strategy. The first version of
software will always be less than ideal.
Do it first to figure it out, throw it
away, and then make a good version
after. Now, that is much more valuable.
And it's nice to see Linear realizing
this same thing, too. I almost feel as
though these types of issues tracking
systems discourage that type of
exploration building because it's so
valuable. According to Linear, the shift
with agents is already underway. Coding
agents are installed in more than 75% of
Linear's enterprise workspaces. Not just
side projects, not just people playing
around with it. The enterprise deals
they have with big businesses using
them. 75% or more are already using
agents is integrations in linear. I bet
you the other 25% are largely
copypasting the issues into their agent
of choice to get the code built. In the
last 3 months, the volume of work
completed by agents grew 5x. Do you
understand how crazy that is in
particular? That's the opus 4.5 effect
when people woke up to how powerful
these models could be and the level of
work they could get done. And obviously
now with Codeex, we can go even further.
They also noted that agents authored
nearly 25% of new issues, which is very
interesting to me. I still haven't
gotten into the letting AI make the
issues side of things. I let them close
them, but I'll let them open them yet.
Maybe I need to get over that. In this
new world, the next system is not
designed around handoffs. It's designed
around context and agents. Agents aren't
mind readers. They become useful through
context. Customer feedback, internal
ideas, strategic direction, decisions,
and code all need to be captured in a
system that humans and agents can work
from together. Very interesting. That
system should understand intent, route
work to the right actor, escalate when
needed, and keep execution moving. It
should help teams move work forward, not
trap them inside the process. The number
of people I know whose jobs are
effectively just using linear or Jira is
heartbreaking. Like those apps are good.
Okay, one of those apps is good, but
none of those apps are good enough to
spend your day in them. As somebody who
spends their day in email lately, I I
empathize. And this is apparently what
Linear plans to become. Linear is the
shared product system that turns context
into execution. That's a really cringe
oneliner. I don't like that. I hope they
rethink that. It holds feedback, intent,
decisions, plans, and code. Shapes that
context into work and helps humans and
agents carry it all the way to
production. You have customer requests,
bugger reports, and feedback. Those
become the context with the plans,
discussion, specs, all of the above.
That becomes rules that are used to
actually command the agents within the
context like automation, skills, and
permissions that is handed to the agents
and the output is the product. Notice
that there are no issues here. Notice
that there is no sprint planning here.
This is incentive context rules
developer effectively. In order to get
there, they just launched a bunch of new
things. They have a linear agent that
you can use to actually do a lot of the
work against your context. They have a
new skills product which lets you codify
things that are being done over and
over. And then automations which will
allow you to automatically trigger
things remotely. I'm assuming. Yeah.
Triage will trigger agent workflows the
moment an issue enters the system. Every
new issue adds context to your workspace
and linear can now intelligently refine,
synthesize, or take action on the
context the moment it arrives. Cool. I
think automations are more and more
going to become like the next new thing.
Do I not even have the codeex app
installed on this computer? I don't. I
just formatted this and I've been using
a better app recently, believe it or
not. Uh certain T3 code. I want to show
a feature in here back in this
lackluster laggy app that broke my brain
because of how cool it is to build this
way but just doesn't handle the scale
that we build at sadly. So it does have
some really cool things in it. I think
the skills browser and creator thing is
relatively cool. I've been able to make
some useful things in this. Not my
favorite thing, but it's decent. I don't
think the official OpenAI docs skill
should be included by default. That's
cringe. Happy I went to this page. I had
a bunch of useless skills that were on
by default. That is fixed now though.
But that's not the top I'm here for. I'm
here for automations. I will be honest,
I overlooked automations when I started
using the Codeex app. And I've noticed
that most devs have as well. For
whatever reason, devs just aren't as
into this side of things. And I kind of
get why. A lot of the examples are just
not very good for developers. Like, what
dev wants to summarize yesterday's Git
activity for a standup? They don't. I
promise you. What dev wants to
synthesize this week's PRs, rollouts,
and incidents, and reviews into a weekly
update, the kind that's not very good at
coding and is on a quick path to become
a PM or a designer of some form. And
then release prep. Draft weekly release
notes for merged PRs. Before tagging,
verify change logs, migrations, feature
flags, and tests. Let's say I want to
set up one of these. I click it. I can
set a schedule. So, I can choose when I
want it to fire. If I want it to fire
daily at 9:00 a.m., I can choose what
project it fires in. It will spin up a
work tree and then go do the thing. You
can even choose which model and
reasoning levels with this really weird
pinned thing there. God, I hate this UI.
Whatever. You get the idea. This is a
concept that I personally didn't think
was the coolest thing ever. It wasn't a
big, oh yeah, this is great. Something I
learned recently is that there's an
increasing number of non-devs using the
Codeex app lately. A lot of them are
doing it because they have things on
their computer that they wanted to be
able to do, but even more are using it
from what I've seen because they love
automations. I know a conserson at a
startup that's using an automation to go
check a bunch of different websites and
news sources for mentions of their
company in order to then bring it into
Slack. So, the automation will fire, go
find all this info, and then DM her on
Slack the results. And this person's
never been a dev before. They had
friends at the company using Codex app.
They thought it was cool to check out
and they just fell in love with
automations. They have like 30 plus of
them now doing all sorts of [ __ ] To
normies, this is the first time they
could automate part of their life or
work. And I don't think most developers
think this way because to an extent we
already learned how to automate things.
That's why we're developers. But we know
how much work it is to automate things.
So, we often don't bother because
writing the code to automate something
like grabbing all of the commits that
you did in the last week and dumping
that as some information to you on Slack
or whatever, that's code all of us can
write. We're all devs. Almost every
single person watching this is good
enough at writing code to do something
like that. But, it's also a lot of work
to do it. So, we've kind of trained our
brains to ignore the urge to automate
things that aren't super useful. People
who have never had this experience
before are all of a sudden able. And now
that it's easier, they're doing it even
more. I know way people doing
automations outside of the dev world
than inside of it. And if I'm being
frank, and this is not meant to be an
insult, this is an observation. The devs
I find who are using automations a lot,
who are using Open Claw a lot and using
those types of things tend to be the
less good devs that I've worked with. No
offense to these two particular people,
but two of the actual worst devs I've
ever seen in my life are OpenClaw gods.
One of them built their own equivalent
of OpenClaw before it came out and it
barely worked and it resulted in her
spam texting me dozens of times a day as
she was trying to make it function at
all. It's kind of weird. Them liking
automations doesn't make them bad, but
it almost seems like we as devs have
wired our brain against this type of
thing. And people who are less wired
into the dev world are more wired in a
way where they're willing to do this
type of thing. So, while the linear
automations that they're describing here
might seem not that cool to us as devs,
I know to me it's like my instinct is,
"Oh, whatever. What is it actually going
to add, I promise you, the PMs, the
leads, the people who don't code are
going to love this and they're going to
massage it into something useful almost
certainly." I will say the end here is
kind of cringe. These updates build on
our early work in triage intelligence
and deep integrations with cloud coding
agents and other AI tools. By grounding
agents in the full context of your
product and codebase, we are collapsing
the distance between an idea and its
implementation. Issue tracking was built
for handoffs. Linear turns context into
execution. So here's my hot take. I
personally not found much value in
things like GStack. If you're not
familiar, I might do a whole video on it
in the near future. The point of GStack
is it gives you a bunch of skills that
are effectively different characters
that are being played by the models to
do specific types of things. Gary built
these specialists, the CEO, founder, the
manager, the senior designer, the design
partner. And to be clear, these aren't
like code or anything complex. These are
just markdown. These are just text files
that describe how the model should
behave in these times and in these
particular requests. For what it is
worth, I think this is cringe as [ __ ]
There are some fun ideas in here like
/codex, which because this is built for
cloud code, this will call the codec cli
from cloud code to review the changes
and give a second pass saying, "Yeah,
I'm Codex. I think that's good or bad."
Chat's already figured it out. So, this
is how devs roleplay. Yeah. My hottest
take is that the way we have broken up
work historically only made sense
because developers and other fields that
we interfaced with were different enough
and hard enough to find and level up in
that we needed to have these roles so
that we could get the work done and meet
the quality bars that we needed to. But
let's be real here. If the model is
smart enough to be the CEO, to be the
engine manager, to be the designer, to
be the design partner, to be the staff
engineer, to be the debugger, to be a
designer who also knows how to code, to
be the QA lead and reporter. If the
model's smart enough to be all of these
things, why are we still defining these
things? Why do we need to have a thing
for this anymore? My hot take is that
the way we have broken up all these
pieces made sense when humans did it and
a given human could only do one of these
things. Now that AI is smart enough to
do most of these things, the way we
break up the work no longer makes sense.
And I see this all over the place. One
of the places I see it the most is
multi-step planning processes. There's
no reason for planning to take hours.
There's no reason for planning to fill
your entire context. There's no reason
that planning should have lots of
different subplans and steps and a
process and specs and all of that
[ __ ] Models are, for the most part,
good enough. So instead of spending all
of this time after you take in the
request, bug report, whatever to build
all of these additional pieces in for
context like the specs, technical
design, the plans, the decisions, the
summaries, and all that [ __ ] just for
the model to go do the build. Why not
have it start with a build, but
accessing all of these things as tools?
What if the model could do a first pass,
use these things, figure out what
doesn't and doesn't work, and then have
the first pass be the plan, so to speak.
Not that the code is going to be used
directly, but the process of it building
and touching all of those things is
enough for you to realize, oh, I guess
that's how this works. I guess that's
where the flaws are. And then from
there, make a much simpler plan that
actually touches the things you need.
And then go build it again. We went
through this loop already with MCP,
funny enough, where we thought this new
standard was going to be the best way
for models to access data and do things.
And then it sucked. So, we ended up
moving it back to code because models
are really good at writing code. And
once the models could use code to use
MCP, all of a sudden it got way, way
better and way more performant and
reliable. I think we're going to go
through the same thing here. We're in a
weird spot now where we're going to
reinvent everything based on how it
always worked, even though it doesn't
[ __ ] matter. And what we're going to
end up back at is code is planning.
We're going to reinvent plans a million
[ __ ] times over the next year. And
then we're going to just go back to
code. I like what Nean had to say here.
This is the functional versus product
divisions at companies. I absolutely
agree there. Here's a fun fact I learned
recently. Did you know that GitHub has a
separate product and engineering org?
Did you know that they share zero
leadership? That product and the people
who actually build the product cannot
interact with each other? Cuz I didn't
know that until recently. And it
explained a lot of why GitHub is a
[ __ ] disaster. I don't see how GitHub
can ever get better if the product
people don't code and the devs don't
make product decisions. Kind of makes
sense that GitHub is an absolute [ __ ]
shitow. And if we keep pretending that
way of building makes sense, we're going
to keep reinventing shitty processes
that only worked for humans. There is a
way I could be wrong here though, and I
don't know cuz I haven't done enough of
this like code as plan type thing
because I'm too busy to do either coding
as a plan or coding in general. I have
way too much [ __ ] [ __ ] going on. I do
plan to do this, pun intended. But there
is a potential failure case in the way
I'm thinking of this that I'm imagining
now, which is that the reason agents can
work better this way is because they're
trained on data from humans. And there's
enough data of humans working this way
that eventually the AI can do it too
perhaps. And it might be better for the
AI to behave like a human than for it to
behave like an AI because the AI is
trained on humans in the first place. I
don't think that will be the case
though. I still pretty firmly believe
that the best plan is a prototype. And
if you still need a plan after that,
you'll be able to write a much more
informed one after you make a first
trial version of the thing. So instead
of all of this nonsense, I would take
the handful of useful pieces of context
here, throw those into a tool call of
some form and then tell the model, I
want to build a scrappy prototype of
this feature that was described in
whatever request, bug report feedback
was provided. Help me identify the scope
of this and then build this first
version so that we can understand what
foot guns and other shortcomings might
exist in the codebase as we implement
this. You get this early version, you
get a bunch of the things that were hard
about it and then you can go build the
right one. I think that's probably going
to be a better bet. I could be wrong,
but having built with a lot of this [ __ ]
myself, that has been generally the
direction that has worked for me. Hell,
I've been building this way since before
AI. I cannot tell you how many times I
filed a shitty PR to one of our repos
just to showcase the UX or DX that I had
in mind and then poor Julius had to go
make it into actual production ready
code. As Flambo said in chat, "Love
this. Build it three times and throw
away the first two." Yeah, this didn't
make sense when code was expensive, but
now code is cheap as [ __ ] Build the
code. stop inventing all this [ __ ]
So, in some senses, Linear is far ahead
of the curve here. In others, I think
they're still thinking a little too much
about how teams were split up
historically and not enough about how
that's going to change. And I've also
never been so confident that Jira is
[ __ ] Cuz, you know, they aren't
thinking about any of this. They are
thinking so little about this that they
bought one of my least favorite
companies, the browser company, which is
a very good fit if you know anything
about how Jira and Atlassian work, as
well as how much the browser company
doesn't work. I think I've said all I
have to here. As you can tell, I have a
lot of feelings. And hopefully this will
be useful to you guys. I know a lot of
you work at real companies where you're
using things like issue trackers. And I
would love to hear from y'all. What are
you guys doing now? And how has it
changed with AI? Are you using AI with
your issues? What does that look like?
I'm actually really curious and want to
hear more. Let me know. And until next
time, peace ns.
