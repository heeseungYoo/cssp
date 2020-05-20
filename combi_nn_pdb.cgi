#!/usr/bin/perl

print "Content-type:text/xml\n\n";

$secret_path = "/home/cssp/public_html/tjrwns/"; # log files are located
$data_path   = "data/";
$html_path   = "http://cssp2.sookmyung.ac.kr/data/";

$log_code    = $secret_path."log_code.conf";


# parse the form data

read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
@pairs = split(/&/, $buffer);
foreach $pair (@pairs) {
    ($name, $value) = split(/=/, $pair);
    $value =~ tr/+/ /;  
    $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
    $FORM{$name} = $value;
}

# Access Log
open(TIH,$log_code);
     $dlist=<TIH>;
     @code = split(' ',$dlist);
close(TIH);

$query_name = $code[1];

# Write Log
open(TIH,">$log_code") || die dienice("Can't access $log_code!\n");
    printf TIH "%s %5d",$code[0],$code[1]+1;
close(TIH);



# Main Calculation Routine ###################################

$nhtml = $html_path.$query_name.".html";




# Write input data

$seq = $FORM{'sequence'};
$seq =~ s/[\n\s]//g;
$structs = $FORM{'structs'};
$nn = $FORM{'nn'};
$residue = $FORM{'residue'};
@res = split(',',$residue);
$key = $FORM{'key'};

$input = $data_path.$code[1].".dat";

open(TIH,">$input") || die dienice("Can't access $input!\n");

print TIH "> $FORM{'comment'}\n";

$c = 0;
$lc = 0;
$lineCount = 0;

print TIH "KEY $key\n";

for ($j=0;$j<length($seq);$j++) {
    
    $q[$c] = uc(substr($seq,$j,1));
    $s = substr($structs,$j,1);
    if ($q[$c] =~ /[ACDEFGHIKLMNPQRSTVWY]/ ) { # Detect abnormal amino acids
	
	    printf TIH "SEQ $q[$c] $s $res[$j]\n";

	$c++;
    }elsif ($q[$c] !~ / /) {                 # Only blank space is allowed
	exit(0);
    }
}
    $total = $c;
close(TIH);



if ($nn eq "single") {
    `./single_run_pdb.pl $query_name`
}else {
    `./dual_run_pdb.pl $query_name`;
}

#####


print "<data>";
print "<number>$query_name</number>";
print "</data>";

