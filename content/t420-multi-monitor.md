title:  Linux on a T420 utilizing a dock and multiple monitors
date:   2013-03-11 11:40:00
tags:   linux, t420, twinview, xinerama
desc:   Multi-monitor setup for a T420 with a docking station

This article is intended to document my efforts to set up (Debian) GNU/Linux
on a Thinkpad T420 (with an nVidia GPU) utilizing a Docking Station which is
connected to two Monitors via DVI. It was written in the hopes that it will
be useful to people having similar setups.

This setup utilizes the nVidia GPU to the fullest when docked without the
need for hacks like bumblebee.

## Multi-Monitor Setup (Twinview, Xinerama)
The Thinkpad T420 comes in two variants: Variant A comes with a dedicated
nVidia GPU in addition to an Intel GPU, whilst Variant B ships with a Intel
GPU only. The following description *only* applies to Variant A.

When connecting the T420 to a docking station, the nVidia GPU is hardwired
to the two DVI outputs. This comes in handy because we don't need to worry
about rendering on a GPU that is not physically connected to an output,
which essentialy makes hacks like bumblebee superfluous.

### Configuring Xorg
The approach I'm taking here involves having a single `xorg.conf` with
multiple layouts, and a small shell script which either picks the right
setup automatically (depending on whether you are docked), or lets you
decide. I found this to be more reasonable than having multiple xorg.conf
files that you'd otherwise have to synchronize each time you change
something. However, splitting the following configure file into several
files and using the include directive should work as well.

We'll start off with creating a single `xorg.conf` file:

~~~~
Section "ServerFlags"
    Option         "DefaultServerLayout" "intel"
    Option         "DontZap" "off"
    Option         "BlankTime" "0"
EndSection

### NVidia (Twinview) Configuration STARTS ###

Section "ServerLayout"
    Identifier     "nvidiatwin"
    Screen      0  "nvidiatwin" 0 0
EndSection

Section "Device"
    Identifier     "nvidiatwin"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BoardName      "NVS 4200M"
    BusID          "PCI:1:0:0"
    Option         "NoLogo" "1"
    Option         "Coolbits" "1"
EndSection

Section "Screen"
    Identifier     "nvidiatwin"
    Device         "nvidiatwin"
    Monitor        "LG0"
    DefaultDepth    24
    Option         "TwinView" "1"
    Option         "TwinViewXineramaInfoOrder" "DFP-2"
    Option         "metamodes" "DFP-2: nvidia-auto-select +0+0, DFP-3: nvidia-auto-select +1680+0"
    SubSection     "Display"
        Depth       24
    EndSubSection
EndSection

### NVidia (Dual-Screen) Configuration STARTS ###

Section "ServerLayout"
    Identifier     "nvidia"
    Screen      0  "nvidia0" 0 0
    Screen      1  "nvidia1" RightOf "nvidia0"
    Option         "Xinerama" "1"
EndSection

Section "Device"
    Identifier     "nvidia0"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BoardName      "NVS 4200M"
    BusID          "PCI:1:0:0"
    Option         "NoLogo" "1"
    Option         "Coolbits" "1"
    Screen         0
EndSection

Section "Device"
    Identifier     "nvidia1"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BoardName      "NVS 4200M"
    BusID          "PCI:1:0:0"
    Option         "NoLogo" "1"
    Option         "Coolbits" "1"
    Screen         1
EndSection

Section "Screen"
    Identifier     "nvidia0"
    Device         "nvidia0"
    Monitor        "LG0"
    DefaultDepth    24
    Option         "TwinView" "0"
    Option         "metamodes" "DFP-2: nvidia-auto-select +0+0"
    SubSection     "Display"
        Depth       24
    EndSubSection
EndSection

Section "Screen"
    Identifier     "nvidia1"
    Device         "nvidia1"
    Monitor        "LG1"
    DefaultDepth    24
    Option         "TwinView" "0"
    Option         "TwinViewXineramaInfoOrder" "DFP-2"
    Option         "metamodes" "DFP-3: nvidia-auto-select +0+0"
    Option         "Rotate" "left"
    SubSection     "Display"
        Depth       24
    EndSubSection
EndSection

Section "Monitor"
    Identifier     "LG0"
    VendorName     "Unknown"
    ModelName      "LG Electronics L227W"
    HorizSync       30.0 - 83.0
    VertRefresh     56.0 - 75.0
    Option         "DPMS"
EndSection

Section "Monitor"
    Identifier     "LG0"
    VendorName     "Unknown"
    ModelName      "LG Electronics L227W"
    HorizSync       30.0 - 83.0
    VertRefresh     56.0 - 75.0
    Option         "DPMS"
EndSection


### NVidia Configuration ENDS ###

### Intel Configuration STARTS ###

Section "ServerLayout"
    Identifier     "intel"
    Screen      0  "intel" 0 0
EndSection

Section "Device"
    Identifier     "intel"
    Driver         "intel"
    Option         "XvMC" "true"
    Option         "UseEvents" "true"
    Option         "AccelMethod" "UXA"
    BusID          "PCI:0:2:0"
EndSection

Section "Screen"
    Identifier     "intel"
    Device         "intel"
    Monitor        "INT"
    DefaultDepth    24
    SubSection     "Display"
        Depth       24
    EndSubSection
EndSection

Section "Monitor"
    Identifier     "INT"
    VendorName     "Unknown"
    ModelName      "Internal T420 Monitor"
    HorizSync       30.0 - 83.0
    VertRefresh     56.0 - 75.0
EndSection

### Intel Configuration ENDS ###
~~~~

Using this configuration file, you can switch between the following three layouts:

* Intel card only (`intel`): Layout you'd use when you are not connected to a dock
* Twinview (`nvidiatwin`): Layout which sets up a single twinview screen spanning both monitors
* Separate screens (`nvidia`): Layout with two xinerama-enabled screens

You can now start your Xorg session by executing:

    startx -- -layout nvidiatwin -nolisten tcp

Please note the difference between dual screens utilizing xinerama and nVidia TwinView.
TwinView is a nvidia-only setup that creates one large desktop you can use to play games
that span both monitors for example. The other setup comprises of two separate screens
with xinerama enabled (so that you can drag a window from one monitor to the other).
The difference becomes obvious when you query the screen size using `xrandr`: The
TwinView setup will report one large screen, whilst the other setup will actually report
two screens.

This setup is however not very user-friendly. I created a little script called
`xorg-layout-chooser` using `dialog` which automatically detects your current setup:

~~~~ {.bash}
#!/bin/bash

# Default mode when not conntected to a docking station
DEFUALT_LAYOUT="intel"

# Default mode when conntected to a docking station
DEFAULT_LAYOUT_DOCKED="nvidia"

# Timeout in seconds
TIMEOUT=3

LAYOUT_FILE=/tmp/layout.mode

dialog --clear --timeout ${TIMEOUT} \
  --menu "Select xorg layout" 12 70 5 \
        "auto" "Auto-Detect" \
        "intel" "Intel" \
        "nvidiatwin" "nVidia TwinView" \
        "nvidia" "Separate nVidia Screens" 2>${LAYOUT_FILE}

if [ $? -ne 0 ] || [ `cat ${LAYOUT_FILE}` == "auto" ]; then
    if `lsusb | grep -q "Lenovo ThinkPad Mini Dock"`; then
        LAYOUT=${DEFAULT_LAYOUT_DOCKED}
    else
        LAYOUT=${DEFAULT_LAYOUT}
    fi
else
    LAYOUT=`cat ${LAYOUT_FILE}`
fi

echo ${LAYOUT}
~~~~

If you use your shell rc files to start xorg, in my case `~/.zshrc`, you can now
change it to the following:

~~~~ {.bash}
if [ "$(tty)" = "/dev/tty1" ]; then
    startx -- -layout `xorg-layout-chooser` -nolisten tcp
fi
~~~~

As a result, you'll be presented the following dialog when logging in on *tty1*:

![Layout chooser dialog](/images/xorg-chooser.png)

### OpenGL

Still, this setup may not work when OpenGL comes in. This is because, depending
on your distribution, the GLX link will point to the incorrect libraries. On
Debian, you can simply set the links using `update-alternatives`:

    update-alternatives --set glx /usr/lib/nvidia

For the Intel card, it is:

    update-alternatives --set glx /usr/lib/mesa-diverted

This can of course be integrated into the scripts mentioned above, possibly utilizing `sudo`.

On some distributions that don't provide a sophisticated alternatives system (such
as Arch Linux - last time I checked), you may be unable to switch the GLX libraries,
and the libraries of the driver that was installed last will be used.
