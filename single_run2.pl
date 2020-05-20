#!/usr/bin/perl

$query_name = $ARGV[0];

#$main_path   = "/home/cssp/public_html/2008/";
$data_path   = "data/";
#$html_path   = "http://compbio.sookmyung.ac.kr/~cssp/2008/data/";

$input = $data_path.$query_name.".dat";

$OPT_NET = "opt.net";

$steps = 20; # number of contact level

@ct = (
       -1.0,
       -0.9,
       -0.8,
       -0.7,
       -0.6,
       -0.5, 
       -0.4, 
       -0.3,
       -0.2, 
       -0.1,
          0,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9
       );

$tt[0] = 0.90;     ## Cutoffs for color changes
$tt[1] = 0.80;
$tt[2] = 0.75;
$tt[3] = 0.70;
$tt[4] = 0.60;
$tt[5] = 0.50;

$res   = 1;

$wsize = 7;  # query sequence size

$init = 30;
for ($i=0;$i<$steps;$i++) {
     $p[$i] = $init+$i;
}
$init += $steps;
for ($i=0;$i<$steps;$i++) {
     $pa[$i] = $init+$i;
}
$init += $steps;
for ($i=0;$i<$steps;$i++) {
     $pb[$i] = $init+$i;
}
$init += $steps;
for ($i=0;$i<$steps;$i++) {
     $pc[$i] = $init+$i;
}
$init += $steps;
for ($i=0;$i<$steps;$i++) {
     $jury[$i] = $init+$i;
}
$init += $steps;
for ($i=0;$i<$steps;$i++) {
     $ok[$i] = $init+$i;
}

%mat = ( "A","1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "R","0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "N","0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "D","0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "C","0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "Q","0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "E","0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0",
         "G","0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0",
         "H","0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0",
         "I","0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0",
         "L","0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0",
         "K","0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0",
         "M","0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0",
         "F","0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0",
         "P","0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0",
         "S","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0",
         "T","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0",
         "W","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0",
         "Y","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0",
         "V","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1",);

# Main Calculation Routine ###################################
     
$nh    = $data_path.$query_name.".html";
$nx    = $data_path.$query_name.".txt";
$xmlPath = $data_path.$query_name.".xml";

$total = Get_query_fragments($input);

for ($i=0;$i<$steps;$i++) {    # iteration for the number of bins

     $np = $data_path.$query_name.".pat.".$i;
     $nr = $data_path.$query_name.".res.".$i;
     $nb = $data_path.$query_name.".bat.".$i;
     $nl = $data_path.$query_name.".log.".$i;

     Write_out_NNet_input($total-6,$ct[$i],$np);

     Write_out_NNet_batch($np,$nr,$nb);

     `Rscript $nb`; 

    #`/usr/X11R6/bin/batchman -f $nb -l $nl > data/zzz`;         # NNet calc
}

gen_HTML($data_path.$query_name,$total-6,$nh,$nx, $xmlPath); # Convert result to HTML format

for ($i=0;$i<$steps;$i++) {

     $np1 = $data_path.$query_name.".pat.".$i;
     $nr1 = $data_path.$query_name.".res.".$i;
     $nb1 = $data_path.$query_name.".bat.".$i;
     $nl1 = $data_path.$query_name.".log.".$i;

    `rm -rf $np1 $nr1 $nb1 $nl1`;
}

##############################################################


# The dienice subroutine, for handling errors.
sub dienice {
    my($errmsg) = @_;
    print "<h2>Error</h2>\n";
    print "$errmsg<p>\n";
    print "</body></html>\n";
    exit;
}



sub Get_query_fragments {
    my($input)=@_;
    my($i,$c,$q,$total,$dlist);
    my($lc);

    open(NN,$input) || die "File open error - $!";

    $c = 0;
    $lc = 0;

    while ($dlist=<NN>) {

#       $dlist = substr($dlist,0,length($dlist)-1);    # Remove the end character

       if (substr($dlist,0,1) ne ">") {

            for ($j=0;$j<length($dlist);$j++) {

                $q[$c] = uc(substr($dlist,$j,1));

                if ($q[$c] =~ /[ACDEFGHIKLMNPQRSTVWY]/ ) { # Detect abnormal amino acids
                     $c++;
	        }
            }
       }
    }
    $total = $c;

    close(NN);

    for ($i=3;$i<$total-3;$i++) {

	$arr[$i-3][$res] = $q[$i-3].$q[$i-2].$q[$i-1].$q[$i].$q[$i+1].$q[$i+2].$q[$i+3];
    }

    return $total;
}

sub  Write_out_NNet_batch {
    my($pattern,$result,$output)=@_;

    open(BB,">$output") || die "File open error - $!";

    ##printf BB "loadNet(\"$OPT_NET\")\n";
    ##printf BB "loadPattern(\"$pattern\")\n";
    ##printf BB "testNet()\n";
    ##printf BB "saveResult(\"$result\",1,PAT,FALSE,FALSE,\"create\")\n";

    print BB "require(RSNNS)\n";
    print BB "snnsObject <- SnnsRObjectFactory()\n";
    print BB "snnsObject\$loadNet(\"$OPT_NET\")\n";
    print BB "patterns = readPatFile(\"$pattern\")\n";
    print BB "patterns = patterns[,1:141]\n";
    print BB "patset = snnsObject\$createPatSet(patterns)\n";
    print BB "snnsObject\$setCurrPatSet(patset\$set_no)\n";
    print BB "outputs <- snnsObject\$predictCurrPatSet(\"train_H80\")\n";
    print BB "write.table(outputs, file = \"$result\", sep= \" \", col.names = F, row.names = F)\n";
    close(BB);

}
sub Write_out_NNet_input {
    my($total,$ct,$output)=@_;
    my($cc,$i);

    open(AA,">$output") || die "File open error - $!";
    printf AA "SNNS pattern definition file V3.2\n";
    printf AA "generated at Fri Jul 12 17:43:41 2002\n";
    printf AA "\n";
    printf AA "No. of patterns : $total\n";
    printf AA "No. of input units : 141\n";
    printf AA "No. of output units : 3\n";
    printf AA "\n";

    $cc = 0;
    for ($i=0;$i<$total;$i++) {
         save_file($i,$ct);
         $cc++;
    }
    close(AA);
}
sub save_file {
    my($c,$ct)=@_;
    my($i,$j,$q);

    printf AA "# %s\n",$arr[$c][$res];
    printf AA "%f\n",$ct;

    for ($i=0;$i<$wsize;$i++) {

         $q = substr($arr[$c][$res],$i,1);

         printf AA "$mat{$q}\n";
    }

    printf AA "# output\n";
    printf AA "1 0 0\n";      # Arbitrary output

    return 1;
}


############################################################
# HTML display of SNNS results
# July 11, 2006
############################################################

sub gen_HTML {
    my($qn,$total,$nh,$nx,$xmlPath)=@_;
    my($i,$qname);

    for ($i=0;$i<$steps;$i++) {  # Retrieve NN prediction result

        $qname = $qn.".res.".$i;
        get_data($qname,$i);
    }
	Write_out_XML($output,$total,$xmlPath);
    Write_out_TXT($output,$total,$nx);
    Write_out_HTML($output,$total,$nh);
}

sub get_data {
    my($input,$bin)=@_;
    my($dlist,$c,@trr);

    open(HH,$input) || die "File open error - $!";

    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;
    #$dlist=<HH>;

    $c = 0;
    while ($dlist=<HH>) {

       @trr = split(' ',$dlist);

       if (substr($trr[0],0,1) ne "#") {
          $trr[0] = sprintf("%.5f", $trr[0]);
          $trr[1] = sprintf("%.5f", $trr[1]);
          $trr[2] = sprintf("%.5f", $trr[2]);

          $arr[$c][$pa[$bin]] = $trr[0];
          $arr[$c][$pb[$bin]] = $trr[1];
          $arr[$c][$pc[$bin]] = $trr[2];

          if (($trr[0]>$trr[1])&&($trr[0]>$trr[2])) {

               $arr[$c][$jury[$bin]] = "h";
               $arr[$c][$p[$bin]] = $trr[0];
          }
          elsif (($trr[1]>$trr[0])&&($trr[1]>$trr[2])) {

                $arr[$c][$jury[$bin]] = "e";
                $arr[$c][$p[$bin]] = $trr[1];
          }
          else {
                $arr[$c][$jury[$bin]] = "c";
                $arr[$c][$p[$bin]] = $trr[2];
          }
          $c++;
       }
    }
    close(HH);

    $arr[0][$ok[$bin]] = 1;
    $arr[$c-1][$ok[$bin]] = 1;

    for ($i=1;$i<$c-1;$i++) {    # initialize OK values !!!

         if (($arr[$i][$jury[$bin]] ne $arr[$i-1][$jury[$bin]])&&($arr[$i][$jury[$bin]] ne $arr[$i+1][$jury[$bin]])) {
              $arr[$i][$ok[$bin]] = 0;
         }
         else { $arr[$i][$ok[$bin]] = 1; }
    }

    for ($i=1;$i<$c-1;$i++) {    # 3-consecutive resideu-based decision

        if ($arr[$i][$ok[$bin]] == 0) {

            if ($arr[$i+1][$ok[$bin]] != 0) { # Single point
                if ($arr[$i-1][$jury[$bin]] eq $arr[$i+1][$jury[$bin]]) { # flanking sec are same
                    $arr[$i][$jury[$bin]] = $arr[$i+1][$jury[$bin]];
                    $arr[$i][$p[$bin]] = p_update($arr[$i][$jury[$bin]],$i,$bin);
                }
                else {                                        # flanking sec are different
                    if (($arr[$i][$pa[$bin]]>$arr[$i][$pb[$bin]])&&($arr[$i][$pb[$bin]]>$arr[$i][$pc[$bin]])) {
                        $arr[$i][$jury[$bin]] = "e";
                        $arr[$i][$p[$bin]] = $arr[$i][$pb[$bin]];
                    }
                    elsif (($arr[$i][$pc[$bin]]>$arr[$i][$pb[$bin]])&&($arr[$i][$pb[$bin]]>$arr[$i][$pa[$bin]])) {
                        $arr[$i][$jury[$bin]] = "e";
                        $arr[$i][$p[$bin]] = $arr[$i][$pb[$bin]];
                    }
                    elsif (($arr[$i][$pb[$bin]]>$arr[$i][$pa[$bin]])&&($arr[$i][$pa[$bin]]>$arr[$i][$pc[$bin]])) {
                        $arr[$i][$jury[$bin]] = "h";
                        $arr[$i][$p[$bin]] = $arr[$i][$pa[$bin]];
                    }
                    elsif (($arr[$i][$pc[$bin]]>$arr[$i][$pa[$bin]])&&($arr[$i][$pa[$bin]]>$arr[$i][$pb[$bin]])) {
                        $arr[$i][$jury[$bin]] = "h";
                        $arr[$i][$p[$bin]] = $arr[$i][$pa[$bin]];
                    }
                    else {
                        $arr[$i][$jury[$bin]] = "c";
                        $arr[$i][$p[$bin]] = $arr[$i][$pc[$bin]];
                    }
                }
                $arr[$i][$ok[$bin]] = 1;
            }
            else { # dual point

                $tmp1 = p_update($arr[$i+1][$jury[$bin]],$i,$bin);
                $tmp2 = p_update($arr[$i][$jury[$bin]],$i+1,$bin);

                if ($tmp1 > $tmp2) {
                    $arr[$i][$jury[$bin]] = $arr[$i+1][$jury[$bin]];
                    $arr[$i][$p[$bin]] = p_update($arr[$i][$jury[$bin]],$i,$bin);
                }
                else {
                    $arr[$i+1][$jury[$bin]] = $arr[$i][$jury[$bin]];
                    $arr[$i+1][$p[$bin]] = p_update($arr[$i+1][$jury[$bin]],$i+1,$bin);
                }
                $arr[$i][$ok[$bin]] = 1;
                $arr[$i+1][$ok[$bin]] = 1;
            }
        }
    }
}

sub p_update {
    my($sc,$c,$bin)=@_;

    if ($sc eq "h") {
        return $arr[$c][$pa[$bin]];
    }
    elsif ($sc eq "e") {
        return $arr[$c][$pb[$bin]];
    }
    else {
        return $arr[$c][$pc[$bin]];
    }
}

sub Write_out_XML {
    my($output,$total,$xmlPath)=@_;
    my($bin,$text_cc,$k,$j);

    open(TXT,">$xmlPath") || die "File open error - $!";

   printf TXT "CSSP2 - Single Neural Network\n";
    

    #### Color Profile Plotting ####

    for ($j=0;$j<$total;$j++) {

       $center_res = substr($arr[$j][$res],$wsize/2,1);  
       print TXT "$center_res ";

       for ($k=0;$k<$steps;$k++) {

            print TXT "$arr[$j][$jury[$k]] ";
            print TXT "$arr[$j][$pa[$k]] ";
            print TXT "$arr[$j][$pb[$k]] ";
            print TXT "$arr[$j][$pc[$k]] ";
       }
       print TXT "\n";
    }
    close(TXT);
}

sub Write_out_TXT {
    my($output,$total,$txt)=@_;
    my($bin,$text_cc,$k,$j);

    open(TXT,">$txt") || die "File open error - $!";

    
    printf TXT "CSSP2 - Single Neural Network\n";
    

    #### Color Profile Plotting ####

    for ($j=0;$j<$total;$j++) {

       $center_res = substr($arr[$j][$res],$wsize/2,1);  
       print TXT "$center_res ";

       for ($k=0;$k<$steps;$k++) {

            print TXT "$arr[$j][$jury[$k]] ";
            print TXT "$arr[$j][$pa[$k]] ";
            print TXT "$arr[$j][$pb[$k]] ";
            print TXT "$arr[$j][$pc[$k]] ";
       }
       print TXT "\n";
    }
    close(TXT);
}

sub Write_out_HTML {
    my($output,$total,$html)=@_;
    my($bin,$text_cc);


    $unit = 60;    ## Line change
    $bound = $total / $unit;

    $null_table   = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=white><fon
t color=white></font></td>";

    $co1 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#009900></td>";
    $co2 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#00CC00></td>";
    $co3 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#00FF00></td>";
    $co4 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#99FF99></td>";
    $co5 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#E4FFCC></td>";
    $co6 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FFFFBB></td>";
    $co7 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FFFFCC></td>";

    $he1 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#990000></td>";
    $he2 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#CC0000></td>";
    $he3 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FF0000></td>";
    $he4 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FF6666></td>";
    $he5 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FF9999></td>";
    $he6 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FFCCCC></td>";
    $he7 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#FAE7E7></td>";

    $sh1 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#000099></td>";
    $sh2 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#0000CC></td>";
    $sh3 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#0000FF></td>";
    $sh4 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#3333FF></td>";
    $sh5 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#6666FF></td>";
    $sh6 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#9999FF></td>";
    $sh7 = "<td width='7' height='5' style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;' bgcolor=#CCCCFF></td>";

  open(HTML,">$html") || die "File open error - $!";

  printf HTML "<html><body bgcolor=white>\n";
  printf HTML "<head><title>CSSP2</title></head>\n";

  printf HTML "<table align=left border=0>";
  printf HTML "<font face='helvetica' size=4 color=black>CSSP2 - Single Neural Network</font>";

  ## intex table
  printf HTML "<p>";
  printf HTML "<tr><td>";

  printf HTML "<table align=left border=0>";

  printf HTML "<tr>";
  printf HTML "<td align=left height=20 colspan=7><font face='helvetica' size=2><hr></font></td>";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left colspan=7><font face='helvetica' size=1>Helix propensity (1 - 0)</font></td>";
  printf HTML "</tr>";
  printf HTML "<tr>";
  printf HTML "$he1";
  printf HTML "$he2";
  printf HTML "$he3";
  printf HTML "$he4";
  printf HTML "$he5";
  printf HTML "$he6";
  printf HTML "$he7";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left height=12 colspan=7><font face='helvetica' size=2></font></td>";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left colspan=7><font face='helvetica' size=1>Coil propensity (1 - 0)</font></td>";
  printf HTML "</tr>";
  printf HTML "<tr>";
  printf HTML "$co1";
  printf HTML "$co2";
  printf HTML "$co3";
  printf HTML "$co4";
  printf HTML "$co5";
  printf HTML "$co6";
  printf HTML "$co7";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left height=12 colspan=7><font face='helvetica' size=2></font></td>";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left colspan=7><font face='helvetica' size=1>Beta propensity (1 - 0)</font></td>";
  printf HTML "</tr>";
  printf HTML "<tr>";
  printf HTML "$sh1";
  printf HTML "$sh2";
  printf HTML "$sh3";
  printf HTML "$sh4";
  printf HTML "$sh5";
  printf HTML "$sh6";
  printf HTML "$sh7";
  printf HTML "</tr>";

  printf HTML "<tr>";
  printf HTML "<td align=left height=20 colspan=7><font face='helvetica' size=2><hr></font></td>";
  printf HTML "</tr>";

  printf HTML "</table>";
 
  printf HTML "</td></tr>\n";

   #### Color Profile Plotting ####

  printf HTML "<tr><td>";

    for ($k=0;$k<$bound;$k++) {

       printf HTML "<table style='border-collapse:collapse;' cellspacing='0' border=0>";
       printf HTML "<tr>\n";
       printf HTML "<td width=80 valign=bottom align=right>\n";
       printf HTML "<font face='helvetica' size=1><i>>(i,i&plusmn;4)</i> energy\n";
       printf HTML "HIGH<br><br><br><br><br><br><br>\n";
       printf HTML "LOW</font>\n";
       printf HTML "</td>\n";

       printf HTML "<td>";

       printf HTML "<table style='border-collapse:collapse;' cellspacing='0' border=0>";

       printf HTML "<tr>\n";
       printf HTML "<td colspan=$unit><hr>\n";
       printf HTML "</td>\n";
       printf HTML "</tr>\n";

       printf HTML "<tr>\n";

       for ($j=$k*$unit; $j<$k*$unit+$unit; $j++) {

           if ($j>=$total) { last; }

           $center_res = substr($arr[$j][$res],$wsize/2,1);
           printf HTML "<td width='7' align=center style='border-top-width:0; border-right-width:0; border-bottom-width:1; border-left-width:1; border-color:white; border-style:solid;'><font face='helvetica' size=1 color=black>$center_res</font></td>\n";
       }
       printf HTML "</tr>\n";

       for ($bin=$steps-1;$bin>=0;$bin--) {
   
           printf HTML "<tr>\n";

            for ($j=$k*$unit; $j<$k*$unit+$unit; $j++) {

              if ($j>=$total) {
                  last;
              }
              if ($arr[$j][$jury[$bin]] eq "c") {
                  if ($arr[$j][$p[$bin]] >= $tt[0]) {
                      printf HTML "%s\n",$co1;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[1]) {
                      printf HTML "%s\n",$co2;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[2]) {
                      printf HTML "%s\n",$co3;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[3]) {
                      printf HTML "%s\n",$co4;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[4]) {
                      printf HTML "%s\n",$co5;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[5]) {
                      printf HTML "%s\n",$co6;
                  }
                  else {
                      printf HTML "%s\n",$co7;
                  }
              }
              elsif ($arr[$j][$jury[$bin]] eq "h") {
                  if ($arr[$j][$p[$bin]] >= $tt[0]) {
                      printf HTML "%s\n",$he1;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[1]) {
                      printf HTML "%s\n",$he2;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[2]) {
                      printf HTML "%s\n",$he3;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[3]) {
                      printf HTML "%s\n",$he4;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[4]) {
                      printf HTML "%s\n",$he5;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[5]) {
                      printf HTML "%s\n",$he6;
                  }
                  else {
                      printf HTML "%s\n",$he7;
                  }
              }
              else {
                  if ($arr[$j][$p[$bin]] >= $tt[0]) {
                      printf HTML "%s\n",$sh1;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[1]) {
                      printf HTML "%s\n",$sh2;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[2]) {
                      printf HTML "%s\n",$sh3;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[3]) {
                      printf HTML "%s\n",$sh4;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[4]) {
                      printf HTML "%s\n",$sh5;
                  }
                  elsif ($arr[$j][$p[$bin]] >= $tt[5]) {
                      printf HTML "%s\n",$sh6;
                  }
                  else {
                      printf HTML "%s\n",$sh7;
                  }
              }
            }
            printf HTML "</tr>\n";
       }
       printf HTML "</table>\n";

       printf HTML "</td>\n";
       printf HTML "</tr>\n";

       printf HTML "</table>";
    }

    printf HTML "</td></tr>";

    #### Text Profile Plotting ####


    printf HTML "</td></tr>";
    printf HTML "</table>";

    printf HTML "</body></html>";

    close(HTML);
}



