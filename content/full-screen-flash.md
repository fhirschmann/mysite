title: Full-screen flash with multiple monitors
date: 2013-01-13 00:36:00
tags: flash, linux
desc: Prevent Adobe Flash from exiting full-screen

Users of multiple monitors on GNU/Linux usually stumble upon the issue that Adobe
Flash will leave full-screen when another window receives keyboard or mouse input.
This behavior, which seems to be deliberate, is specifically disappointing when you
want to work on one monitor and watch a flash video on the other.

## The workaround
The "workaround" here is to break this behavior in Adobe Flash on purpose. Internally,
Flash uses the `_NET_ACTIVE_WINDOW` property. This read-only property is set by the
window manager and is made up of the window ID of the currently active window or None if no window has the focus.

First, we need to figure out where the plugin was installed to:

    $ find /usr/lib -name 'libflashplayer.so'
    /usr/lib/flashplugin-nonfree/libflashplayer.so

Second, we simply rename the property `_NET_ACTIVE_WINDOW` in `libflashplayer.so` to
`_XET_ACTIVE_WINDOW`. On Debian, the command would be:

    $ perl -pi -e "s/_NET_ACTIVE_WINDOW/_XET_ACTIVE_WINDOW/" /usr/lib/flashplugin-nonfree/libflashplayer.so

Of course, this can be done in one command also:

    $ find /usr/lib -name 'libflashplayer.so' -exec perl -pi -e "s/_NET_ACTIVE_WINDOW/_XET_ACTIVE_WINDOW/" {} \;

Please note that if you happen to use Google Chrome/Chromium, you'll need to disable chrome's
internal flash plugin.
