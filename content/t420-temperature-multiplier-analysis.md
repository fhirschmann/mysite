title:  Thinkpad T420 Temperature-Multiplier Analysis
id:     1
date:   2012-12-22 16:48:00
tags:   linux, t420
desc:   Analysis of Intel Turbo Boost on a Thinkpad T420

I recently ran into the problem that games would not run fluently on my Thinkpad
T420 with an nVidia NVS 4200M. While I'm not exactly a gamer, I do like to play
causally every two or three months. What bothered me was that even games that
don't require much computing and graphic power tend to have frequent "hiccups".

What I call "hiccups" are short freezes of at most four seconds. When I started
researching the issue, it took me a while to pinpoint the exact cause of this.
The T420 features a i5-2520M CPU which is equipped with
[Intel Turbo Boost](http://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html)
which basically means the CPU will run above the base operating frequency when
the operating system requests the highest performance state (P0). I have seen
frequencies peak at 3.2GHz whereas the base frequency is 2.5GHz.

## Intel Turbo Boost on Linux
The Turbo Boost settings are stored in Machine Specific Registers (MSR) which
can be read from and written to using `msr-tools`. On Debian, the tools can be
installed via

    apt-get install msr-tools
    modprobe msr

Once installed, the status of Turbo Mode can be read (on a T420) by executing

    $ rdmsr 0x1a0 --bitfield 38:38
    0

Where 0 indicates that TB is enabled. The current multiplier can be queried by issuing

    $ rdmsr 0x198 --decimal --bitfield 15:8
    8

Please note that `/proc/cpuinfo` will not tell you the correct frequency when TB
is enabled, because it will only ever show you the maximum frequency reported, which is 2.5GHz.

You can disable Turbo Mode on a T420 by calling

    wrmsr 0x1a0 274886623368

and enable it again by running

    wrmsr 0x1a0 8716424

If you want to know more about these registers, I recommend taking a look
at [i7z](http://code.google.com/p/i7z/).

## T420 under High Load
Back to the hiccups. The reason they exist is that the T420 cooling system
is unable to absorb the heat over long periods of time. The following graph
shows the development of the temperature and the clock multiplier with Turbo
Mode and Hyper-Threading enabled while running
[stress](http://weather.ou.edu/~apw/projects/stress/) with 4 worker threads.

![4 Threads, Turbo On, Hyper-Threading on](/images/data_c4_t1_h1.png)

The graph shows that the multiplier decreases to 8 when the temperatures hits
the maximum allowed temperature. This is very unfortunate, because in interactive
programs like games, the user will experience stuttering until the multiplier is
increased again.

It seems to be less of a problem when we stress the CPU with only 1 worker thread,
even though this will raise the multiplier even higher.

![1 Threads, Turbo On, Hyper-Threading on](/images/data_c1_t1_h1.png)

After turning Turbo Boost off, there are no more sudden multiplier drops:

![4 Threads, Turbo Off, Hyper-Threading on](/images/data_c4_t0_h1.png)

The tests I conducted are dependent on the ambient temperature -- frequent hiccups
may not be as reproducible in a setting with low ambient temperatures. I conducted
the tests with an ambient temperature of 25.5 °C.

## Conclusion
Intel Turbo Boost is supposed to decrease the multiplier in increments and not use
an all-or-nothing approach when thermal limits are reached. Unfortunately, this is
not what happens here.

Therefore, I recommend disabling Turbo Boost on a T420 with an nVidia NVS 4200M  if
you have real-time computing needs and experience stuttering in games for example.

If you don't want to go through the trouble of installing msr-tools and setting the
registers, an alternative way of setting the maximum frequency is

    echo "for i in 0 1 2 3; do cpufreq-set -c $i -g ondemand -u 2.50GHz; done" >> /etc/rc.local

on Debian.
