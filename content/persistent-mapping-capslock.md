title:  Persistent remapping of the Caps Lock key
id:     7
date:   2014-01-05 00:23:00
tags:   linux, debian, capslock
desc:   Remap the Caps Lock and Compose Key persistently on Linux

I have been annoyed by the standard way of (re)mapping the Caps Lock and Compose
key for a very long time. Remapping is usually done using `xmodmap`, a tool that
can be used to patch the current keymap in order to make the Caps Lock key behave
like ESC.

However, this solution will not persist if you need to hotplug USB keyboards,
because the keymap is reset as soon as you plug in your new keyboard. I've seen
some solutions using udev rules that patch in new keymaps after hotplugging keyboards.
They were however problematic and did not always work because the udev event was
sometimes triggered before the device was properly registered as keybord with the X11 subsystem.

The proper way to fix this behavior is to modify `/etc/default/keyboard` and set:

    XKBOPTIONS="compose:rwin,terminate:ctrl_alt_bksp,caps:escape"

The above line will do the following:

- Map the right windows key to Compose
- Allow CTRL+ALT+Backspace to kill the X Server
- Map Caps Lock to ESC

Non-debian users should be able to achieve the same results by modifying their `xorg.conf`:

    Section "InputClass"
        Identifier      "Keyboard Defaults"
        MatchIsKeyboard "yes"
        ...
        Option           "XkbOptions" "compose:rwin,terminate:ctrl_alt_bksp,caps:escape"
    EndSection
