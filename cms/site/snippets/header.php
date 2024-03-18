<?php 
    $result = array();

    foreach ($site->children()->listed() as $item) {
        $result[] = array("active" => $item->isOpen(), "title" => $item->title()->esc(), "url" => $item->url());
    } 

    // print the header data - captured by templates via ob_start()
    ob_start();

    echo json_encode($result)."\n";

    $header = ob_get_clean();
?>
