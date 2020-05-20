#!/usr/bin/perl

use strict;
use Time::HiRes qw( time );

my $begin_time = time();

sleep(10);

my $end_time = time();
printf("%.2f\n", $end_time - $begin_time);
