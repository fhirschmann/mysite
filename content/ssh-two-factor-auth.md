title: SSH and two factor authentication
date: 2013-02-26 21:28:29
tags: android, security, linux
desc: Two factor authentication for SSH

Today, when I switched from Google's SMS-based 2-step verification to the 
Android-based version, I discovered that there exists an
[open-source version](http://code.google.com/p/google-authenticator/) of
Google's HMAC-based One Time Password (HOTP) implementation. Better yet,
it includes a PAM module that can be incorporated into PAM and thus SSH.

Because I sometimes log into my server from untrusted sources (university
computer pool), I decided to give it a try. It turned out to be quite
straightforward, and now I have to enter a One Time Password (OTP) in
addition to my user password each time I log into my server. This is
however not required when I use public key authentication from home.

## Installation
As said, the set up is straightforward. First, besides the usual compiler
toolchain, the following dependencies are required:

    apt-get install libpam-dev libqrencode3

Next, grab google-authenticator from upstream:

    git clone https://code.google.com/p/google-authenticator/

And install it:

    cd google-authenticator/libpam
    make && make install

## Setup
Edit `/etc/ssh/sshd_config` and set:

    ChallengeResponseAuthentication yes

Now, activate the authenticator by adding the pam module to the first
line in `/etc/pam.d/sshd`:

    auth required pam_google_authenticator.so nullok

## Activation
You can now activate 2-step verification by executing `google-authenticator`,
which should yield something like this (this is not the key I'm actually using):

![command result](/images/gar.png)

You can now scan the QR-Code produced by `google-authenticator` using the
[Android App](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en).
When you now try to log into your server, the prompt will look something like this:

    root@t420:/home/fabian/ > ssh fabian@0x0b.de
    Verification code:
    Password:

At which point you can bring up the app that will look something like this:

![android app](/images/2sapp.png)
