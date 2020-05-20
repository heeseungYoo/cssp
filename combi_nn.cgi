#!/usr/bin/perl -w

print "Content-type:text/html\n\n";

$secret_path = "/home/heeseung/public_html/public_html_new/tjrwns/"; # log files are located
$data_path   = "/home/heeseung/public_html/public_html_new/data/";
$html_path   = "http://compbio.sookmyung.ac.kr/~heeseung/public_html_new/data/";

$log_code    = $secret_path."log_code.conf";

# parse the form data

## standard input, $buffer, $buffer의 data length
read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
@pairs = split(/&/, $buffer);
foreach $pair (@pairs) {
    ($name, $value) = split(/=/, $pair);    ## nn_set = single, sequence = ~~
    $value =~ tr/+/ /;  
    $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;    ## data decoding 
    $FORM{$name} = $value;  ## hash(연상배열) 일종의 key-value 같은 것 
}

# Access Log
open(TIH,$log_code);        ## log_code = 1 48236
     $dlist=<TIH>;          ## dlist = 1 48236
     @code = split(' ',$dlist);     ## $code[0] = 1, $code[1] = 48236
close(TIH);

$query_name = $code[1];     ## query_name = 48236

# Write Log
open(TIH,">$log_code") || dienice("Can't access $log_code!\n");     ## 쓰기 상태로 file open
    printf TIH "%s %5d",$code[0],$code[1]+1;    # 1 48237
close(TIH);



# Main Calculation Routine ###################################

$nhtml = $html_path.$query_name.".html";    ## $nhtml = http://compbio.sookmyung.ac.kr/~heeseung/public_html_new/data/48236.html

print "<html>\n";

print "<head>\n";
print "<title>Advanced CSSP</title>\n";
print "<link rel='shortcut icon' href='#'>\n";    
print "<script language='JavaScript'>\n";
print "<!--\n";
print "function item(fn, win) {\n";
print "       this.fn = fn;\n";
print "       this.win = win;\n";
print "}\n";
print "function makeArray(length) {\n";
print "        this.length = length \n";
print "}\n";
print "function fork(id) {\n";
print "prop = new makeArray(1)    \n";
print "prop[1] = new item('$nhtml','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,height=650,width=840');\n";
print "\n";
print "var child = $query_name;\n";
print "\n";  
print "child=window.open(prop[id].fn, child, prop[id].win);\n";
print "child.focus();\n";
print "}\n";
print "// -->\n"; ## why? 주석처리
print "</script>\n";
print "</head>\n";
print "\n";

print "<body bgcolor=white>\n";
print "<font size=3 face='helvetica' size=3>";

print "<font size=3 face='helvetica' size=3>Protein name : $FORM{'comment'}</font><br><br>";    ## protein name 안 뜸// comment


# Write input data

$seq = $FORM{'sequence'};
$seq =~ s/[\n\s]//g;        ## 띄어쓰기 없앰
$structs = $FORM{'structs'};

$input = $data_path.$code[1].".dat";    ## "data/48237.dat"

open(TIH,">$input") || dienice("Can't access $input!\n");       ## write로 open

    print TIH "> $FORM{'comment'}\n";   ## data/48237.dat에 "> 'protein name'" 작성 (sequence 인듯) // comment
    #print TIH "> ";

    $c = 0;
    $lc = 0;
    $lineCount = 0;
    for ($j=0;$j<length($seq);$j++) {

        $q[$c] = uc(substr($seq,$j,1));

        if ($q[$c] =~ /[ACDEFGHIKLMNPQRSTVWY]/ ) { # Detect abnormal amino acids

            if ($lc < 50) {                        # Output line change in every 50 a.a.
                printf TIH "%s",$q[$c];
                printf "%s",$q[$c];
                $lc++;
            }
            else { 
		        printf TIH "\n%s",substr($structs,$lineCount*50,50);
                printf TIH "\n%s",$q[$c];
                printf "\n<br>%s",$q[$c];
                $lc = 1;
		        $lineCount++;
            }
            $c++;
        }
        elsif ($q[$c] !~ / /) {                 # Only blank space is allowed
            printf "<br>Wrong amino acid residue type at position %d :  %s<br>",$c+1, $q[$c];
            print "Please check your query sequence again<br>";
            exit(0);
        } 
    }
printf TIH "\n%s\n",substr($structs,$lineCount*50,50);      ## 다음줄에 structs 작성
#print TIH "\n$structs\n";
    $total = $c;
close(TIH);

print "<br>\n";
print "\n<br><font size=3 face='helvetica' size=3><br>Total $total amino acid residues<br></size>\n";

if ($FORM{'nn_set'} eq "single") {
	`./single_run.pl $query_name`;      ## 48236
}
else {
    `./dual_run.pl $query_name`;
}

#####

print "<br><br>";


print "<a href=$nhtml target='$query_name' onClick='fork(1)'>Click here to see the result</a>. Thank you.<br><p><br>\n";

print "<br><br>\n";

print "<font size=3 face='helvetica' size=3> <a href=http://cssp2.sookmyung.ac.kr/>back</a></font><br>";
print "</font>";
print "</body></html>";


sub dienice {
    my($errmsg) = @_;
    print "<h2>Error</h2>\n";
    print "<p>$errmsg</p>\n";
    exit;
}