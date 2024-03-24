<?php
    /** Snippets, piped with ob to capture data */
    ob_start();
    include_once(__DIR__ . '/../snippets/header.php');
    
    /** CMS Data */
    $pageData = array("text" => $page->text());

    $json = array(
        "header" => json_decode($header),  
        "page" => $pageData,
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";
?>
