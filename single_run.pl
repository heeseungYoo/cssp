#!/usr/bin/perl -w

$query_name = $ARGV[0];     ## ex) 48246

$data_path   = "/home/heeseung/public_html/public_html_new/data/";

$input = $data_path.$query_name.".dat";     ## data/48246.dat

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
     
$nh    = $data_path.$query_name.".html";        ## data/48246.html
$xmlPath = $data_path.$query_name.".xml";       ## data/48246.xml

$total = Get_query_fragments($input);       ## input = data/48246.dat  ex) "> DVDKVDKJFHB"
for ($i=0;$i<$steps;$i++) {    # iteration for the number of bins

     $np = $data_path.$query_name.".pat.".$i;
     $nr = $data_path.$query_name.".res.".$i;
     $nb = $data_path.$query_name.".bat.".$i;

     Write_out_NNet_input($total-6,$ct[$i],$np);    ## pat

     Write_out_NNet_batch($np,$nr,$nb);     ## bat
     
     `Rscript $nb`;         ## bat 실행 -> res
}

## data/48246, xml, html file 생성 
gen_HTML($data_path.$query_name,$total-6,$nh,$xmlPath); # Convert result to HTML format

deleteFiles();  ## xml 생성 후 file들 삭제 

sub deleteFiles {
    
    for ($i=0;$i<$steps;$i++) {

	$np1 = $data_path.$query_name.".pat.".$i;
	$nr1 = $data_path.$query_name.".res.".$i;
	$nb1 = $data_path.$query_name.".bat.".$i;
    
    my $command = "rm -rf $np1 $nr1 $nb1";
    system($command);
#	`rm -rf $np1 $nr1 $nb1 $nl1`;
    }
}

sub deleteFilesAndDie {
#    deleteFiles();
    die "File open error - $!";
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


#$total = Get_query_fragments($input);
sub Get_query_fragments {
    my($input)=@_;
    my($i,$c,$q,$total,$dlist,$skip);
    my($lc);

    open(NN,$input) || deleteFilesAndDie();

    $c = 0;
    $lc = 0;

    $skip = "false";
    while ($dlist=<NN>) {
	if($skip eq "false"){
	    if(substr($dlist,0,1) ne ">"){
		$structs .= $dlist;
	    }
	    $skip = "true";
	}else{
#       $dlist = substr($dlist,0,length($dlist)-1);    # Remove the end character
	    if (substr($dlist,0,1) ne ">") {
		for ($j=0;$j<length($dlist);$j++) {

		    $q[$c] = uc(substr($dlist,$j,1));

		    if ($q[$c] =~ /[ACDEFGHIKLMNPQRSTVWY]/ ) { # Detect abnormal amino acids
			$c++;
		    }
		}
	    }
	    $skip = "false";
	}
    }
    $total = $c;

    close(NN);

    for ($i=3;$i<$total-3;$i++) {

     $arr[$i-3][$res] = $q[$i-3].$q[$i-2].$q[$i-1].$q[$i].$q[$i+1].$q[$i+2].$q[$i+3];
     #print "arr\t$i\t$res\t$arr[$i-3][$res]\n";
    }

#    `rm -rf $input`;

    return $total;
}



##pat, res, bat
sub  Write_out_NNet_batch {
    my($pattern,$result,$output)=@_;

    #open(BB,">$output") || deleteFilesAndDie();
    open(BB,">$output") || die " no such $output\n";
       
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

#Write_out_NNet_input($total-6,$ct[$i],$np); *.pat.* file
sub Write_out_NNet_input {
    my($total,$ct,$output)=@_;
    my($cc,$i);

    open(AA,">$output") || deleteFilesAndDie();
    print AA "SNNS pattern definition file V3.2\n";
    print AA "generated at Fri Jul 12 17:43:41 2002\n";
    print AA "\n";
    print AA "No. of patterns : $total\n";
    print AA "No. of input units : 141\n";
    print AA "No. of output units : 3\n";
    print AA "\n";

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

         print AA "$mat{$q}\n";
    }

    print AA "# output\n";
    print AA "1 0 0\n";      # Arbitrary output

    return 1;
}


############################################################
# HTML display of SNNS results
# July 11, 2006
############################################################

sub gen_HTML {
    my($qn,$total,$nh,$xmlPath)=@_;
    my($i,$qname);

    for ($i=0;$i<$steps;$i++) {  # Retrieve NN prediction result

        $qname = $qn.".res.".$i;
        get_data($qname,$i);
    }
    Write_out_XML($output,$total,$xmlPath);
    Write_out_HTML($output,$total,$nh);
}

sub get_data {
    my($input,$bin)=@_;
    my($dlist,$c,@trr);

    open(HH,$input) || deleteFilesAndDie();

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

    open(TXT,">$xmlPath") || deleteFilesAndDie();
    
    print TXT "<data>\n";
    print TXT "<title>CSSP2 - Single Neural Network</title>\n";

    ### Color Profile Plotting ###
    
    print TXT "<table>\n";

    $count = 0;

    $paTot = 0;
    $pbTot = 0;
    $pcTot = 0;

    $prevStr = "";
    for($j=0;$j<$total;$j++){

        if($count >=50){
	  print TXT "<count>$count</count>\n";
	  print TXT "</table>\n";
	  $count = 0;
	  print TXT "<table>\n";
       }
    
       $center_res = substr($arr[$j][$res],$wsize/2,1);
#       $num = ($j +3 )%10;
       $num = ($j +3 + 1)%10;                              # revised on 4/11/2009
       print TXT "<column>\n";
       
       print TXT "<number>$num</number>\n";
       print TXT "<center>$center_res</center>\n";
       if(length($structs) > $j+3){
            $struct = substr($structs,$j+3,1);
       }else{
          $struct = "";
       }
	print TXT "<struct>$struct</struct>\n";
       if(length($structs) > $j+4){
            $nextStr = substr($structs,$j+4,1);
       }else{
          $nextStr = "";
       }
	#$strType;

	if($prevStr eq $struct){
	    if($nextStr eq $struct){
		$strType = "middle";
	    }else{
		$strType = "end";
	    }
	}else{
	    if($nextStr eq $struct){
		$strType = "start";
	    }else{
		$strType = "single";
	    }
	}
	if($j == ($total-1)){
	    if($strType eq "middle"){
		$strType = "end";
	    }elsif($strType eq "start"){
		$strType = "single";
	    }
	}
	print TXT "<strType>$strType</strType>\n";

	$prevStr = $struct;



       $paSum = 0;
       $pbSum = 0;
       $pcSum = 0;
 

       for($k=$steps-1;$k>=0;$k--){
	   
	   print TXT "<row>\n";
	   
	   print TXT "<jury>$arr[$j][$jury[$k]]</jury>\n";
	   print TXT "<pa>$arr[$j][$pa[$k]]</pa>\n";
	   print TXT "<pb>$arr[$j][$pb[$k]]</pb>\n";
	   print TXT "<pc>$arr[$j][$pc[$k]]</pc>\n";

	   $paSum += $arr[$j][$pa[$k]];
	   $pbSum += $arr[$j][$pb[$k]];
	   $pcSum += $arr[$j][$pc[$k]];


	   print TXT "</row>\n";
       }
       
       print TXT "<paSum>$paSum</paSum>\n";
       print TXT "<pbSum>$pbSum</pbSum>\n";
       print TXT "<pcSum>$pcSum</pcSum>\n";
       
       print TXT "</column>\n";

       $paTot += $paSum;
       $pbTot += $pbSum;
       $pcTot += $pcSum;

       $count++;
     
    }
    print TXT "<count>$count</count>\n";
    print TXT "</table>\n";

    print TXT "<paTot>$paTot</paTot>\n";
    print TXT "<pbTot>$pbTot</pbTot>\n";
    print TXT "<pcTot>$pcTot</pcTot>\n";
    
    print TXT "<colTot>$total</colTot>\n";

    print TXT "</data>\n";

    close(TXT);
}

sub Write_out_HTML {
    my($output,$total,$nh)=@_;
    my($bin,$text_cc);
    open(HTML,">$nh") || deleteFilesAndDie();

    print HTML "<html lang='en'>\n";
    print HTML "<head>\n";
    print HTML "<title>Cssp</title>\n";
    print HTML "<link rel='shortcut icon' href='#'>\n";
    print HTML "<link rel='stylesheet' type='text/css' href='single.css'>\n";
    print HTML "<script src='https://code.highcharts.com/highcharts.js'></script>\n";
    print HTML "<script src='https://code.highcharts.com/modules/heatmap.js'></script>\n";
    print HTML "<script src='https://code.highcharts.com/modules/exporting.js'></script>\n";
    print HTML "<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>\n";
    print HTML "</head>\n";

    print HTML "<body>\n";
    print HTML "<figure class='highcharts-figure'>\n";
    print HTML "<h3>CSSP2-Single Neural Network</h3>\n";
    print HTML "<div class='legend'>\n";
    print HTML "<table align=left border=0>\n";
    print HTML "<tr><td align=left colspan=7><font face='helvetica' size=1>Helix propensity (1 - 0)</font></td></tr>\n";
    print HTML "<tr><td align=left height=5 colspan=7><font face='helvetica' size=1></font></td></tr>\n";
    print HTML "<tr>\n";
    print HTML "<td width='14' height='4'  bgcolor=#990000></td>\n";
    print HTML "<td width='14' height='4'  bgcolor=#CC0000></td>\n";
    print HTML "<td width='14' height='4'  bgcolor=#FF0000></td>\n";
    print HTML "<td width='14' height='4' bgcolor=#FF6666></td>\n";
    print HTML "<td width='14' height='4' bgcolor=#FF9999></td>\n";
    print HTML "<td width='14' height='4'  bgcolor=#FFCCCC></td>\n";
    print HTML "<td width='14' height='4'  bgcolor=#FAE7E7></td>\n";
    print HTML "</tr>\n";
    print HTML "<tr><td align=left height=5 colspan=7><font face='helvetica' size=2></font></td></tr>\n";
    print HTML "<tr><td align=left colspan=7><font face='helvetica' size=1>Beta propensity (1 - 0)</font></td></tr>\n";
    print HTML "<tr><td align=left height=5 colspan=7><font face='helvetica' size=2></font></td></tr>\n";
    print HTML "<tr>\n";
    print HTML "<td height='4'bgcolor=#000099></td>\n";
    print HTML "<td height='4'bgcolor=#0000CC></td>\n";
    print HTML "<td height='4'bgcolor=#0000FF></td>\n";
    print HTML "<td height='4'bgcolor=#3333FF></td>\n";
    print HTML "<td height='4'bgcolor=#6666FF></td>\n";
    print HTML "<td height='4'bgcolor=#9999FF></td>\n";
    print HTML "<td height='4'bgcolor=#CCCCFF></td>\n";
    print HTML "</tr>\n";
    print HTML "<tr><td align=left height=5 colspan=7><font face='helvetica' size=2></font></td></tr>\n";
    print HTML "<tr><td align=left colspan=7><font face='helvetica' size=1>Coil propensity (1 - 0)</font></td></tr>\n";
    print HTML "<tr><td align=left height=5 colspan=7><font face='helvetica' size=2></font></td></tr>\n";
    print HTML "<tr>\n";
    print HTML "<td height='4'bgcolor=#009900></td>\n";
    print HTML "<td height='4'bgcolor=#00CC00></td>\n";
    print HTML "<td height='4'bgcolor=#00FF00></td>\n";
    print HTML "<td height='4'bgcolor=#99FF99></td>\n";
    print HTML "<td height='4'bgcolor=#E4FFCC></td>\n";
    print HTML "<td height='4'bgcolor=#FFFFBB></td>\n";
    print HTML "<td height='4'bgcolor=#FFFFCC></td>\n";
    print HTML "</tr>\n";
    print HTML "</table>\n";
    print HTML "</div>\n";
    print HTML "<div class="info">\n";
    print HTML "<table>\n";
    print HTML "<tr>\n";
    print HTML "<th height='20'><font face='helvetica' size=1>Total</font></th>\n";
    print HTML "<th></th>\n";
    print HTML "<th><font face='helvetica' size=1>Average (1-0)</font></th>\n";
    print HTML "<th></th>\n";
    print HTML "<th><font face='helvetica' size=1>Selected (mouse click & drag)</font></th>\n";
    print HTML "</tr>\n";
    print HTML "<tr>\n";
    print HTML "<td height='21'><font face='helvetica' size=1 id='paTotal'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='paAverage'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='paSel'>P(helix) = 0.00</font></td>\n";
    print HTML "</tr>\n";
    print HTML "<tr>\n";
    print HTML "<td height='21'><font face='helvetica' size=1 id='pbTotal'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='pbAverage'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='pbSel'>P(beta) = 0.00</font></td>\n";
    print HTML "</tr>\n";
    print HTML "<tr>\n";
    print HTML "<td height='21'><font face='helvetica' size=1 id='pcTotal'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='pcAverage'></font></td>\n";
    print HTML "<td></td>\n";
    print HTML "<td><font face='helvetica' size=1 id='pcSel'>P(coil) = 0.00</font></td>\n";
    print HTML "</tr>\n";
    print HTML "</table>\n";
    print HTML "</div>\n";
    print HTML "<div id='wrapper'>\n";
    print HTML "<div id='description'>\n";
    print HTML "<p style='font-style: italic; font-size: 10; display: inline;'>>(i,i±4)&nbsp;&nbsp;</p>\n";
    print HTML "<a style='font-size: 10;'>energy</a>\n";
    print HTML "</div>\n";
    print HTML "<div id='query_name' value='$query_name'></div>\n";
    print HTML "<script type='text/javascript' src='heatmapSingle.js'></script>\n";
    print HTML "<script type='text/javascript' src='lineChartSingle.js'></script>\n";
    print HTML "</div>\n";
    print HTML "</figure>\n";
    print HTML "</body>\n";
    print HTML "</html>\n";

    close(HTML);
}





