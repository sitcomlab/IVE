---
layout: page
permalink: /extensions/
---


### Overview
1. [Voice control system](#voice-control-system)

***

# 1. Voice control system

The IVE was extended by a voice control system as part of a bachelor thesis.

[<img src="{{ site.baseurl }}/images/voice-control.svg" alt="Voice control system" class="picture" />]({{ site.baseurl }}/)

The property `intent_id` inside a `-[CONNECTED_TO]->` relationship is used by a voice control system.

If a spoken voice command (or better expression) was identified by an external voice recognition system ([Wit.Ai](https://wit.ai)), the external voice recognition system tries to find. responses the identified intent (e.g. `go_left`), which can then be found by the `intent_id` inside all outgoing `-[CONNECTED_TO]->` relationships of the current <span class="label label-location">Location</span>.
