<?php

require_once('./managerClass.php');

$m = new ImageManager();
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=utf-8');

if(isset( $_GET['updateImagesDbFromDir'] )) {
   echo $m->updateImagesDbFromDir();
}

if(isset( $_GET['getAllImages'] )) {
   echo $m->getAllImages();
}
//$m->updateImagesDbFromDir();
//$m->setActivo(31,1);
//$m->deleteImage(31);
//var_dump( json_decode($m->addImage($_FILES["fileToUpload"])));
//var_dump( json_decode($m->getImage(43)));
//var_dump( json_decode($m->getAllImages()));
//var_dump( json_decode($m->setPosicion(43,2)));
?>
