<?php

class ImageManager {

	protected $db;
	protected $maxFileSize;
	protected $slideDuration;
	protected $fadeDuration;
	protected $images_dir = "../../images/";

	function __construct() {
		$this->db = $this->DBconnect();
		$sql = "SELECT * FROM `settings`";
		if ($res = $this->db->query($sql)) {
			while($row = $res->fetch_array(MYSQLI_ASSOC)) {
				$images[$row["nombre"]] = $row;
			}
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
		$this->maxFileSize = $images["maxFileSize"]["valor"];
		$this->slideDuration = $images["slideDuration"]["valor"];
		$this->fadeDuration = $images["fadeDuration"]["valor"];
	}

	protected function DBconnect() {
		$enlace = mysqli_connect("localhost", "root", "", "obssocket");

		if (!$enlace) {
			echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
			echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
			echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
			exit;
		}
		return $enlace;
	}

	public function updateImagesDbFromDir(){
		$sql = "INSERT IGNORE INTO `imagenes` VALUES";
		$sql2 = "DELETE FROM `imagenes` WHERE `url` NOT IN (";
		if ($gestor = opendir($this->images_dir)) {
			while (false !== ($entrada = readdir($gestor))) {
				if ($entrada != "." && $entrada != "..") {
					$sql .= " (null,'".$entrada."',1,0),";
					$sql2 .= "'".$entrada."',";
				}
			}
			$sql = substr($sql, 0, -1);
			$sql .= ";";
			$sql2 = substr($sql2, 0, -1);
			$sql2 .= ");";
			closedir($gestor);

			if ($this->db->query($sql) === TRUE) {
				if ($this->db->query($sql2) === TRUE) {
					return $this->logResultado(1,'');
				} else {
					return $this->logResultado(0,"Error: " . $sql2 . "<br>" . $this->db->error);
				}
			} else {
				return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
			}
		}
	}

	public function logResultado($ok,$msg){
		$arr = array('ok' => $ok, 'msg' => $msg);
		return json_encode($arr);
	}

	function utf8_converter($array){
		array_walk_recursive($array, function(&$item, $key){
			if(!mb_detect_encoding($item, 'utf-8', true)){
					$item = utf8_encode($item);
			}
		});

		return $array;
	}

	public function setActivo($id,$activo){
		$sql = "UPDATE `imagenes` SET `activo` = ".($activo && (is_integer($activo) || is_bool($activo)) ? 1 : 0) ." WHERE `imagenes`.`id` = $id; ";
		if ($this->db->query($sql) === TRUE) {
			return $this->logResultado(1,'');
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
	}

	public function deleteImage($id){
		$sql = "DELETE FROM `imagenes` WHERE `id` = $id";
		if ($this->db->query($sql) === TRUE) {
			return $this->logResultado(1,'');
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
	}

	public function addImage($image){
		$msg = '';
		$check = getimagesize($image["tmp_name"]);
		$target_file = $this->images_dir . basename($image["name"]);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		if($check !== false) {
			$msg .= "File is an image - " . $check["mime"] . ".</br>";
			$uploadOk = 1;
		} else {
			$msg .= "File is not an image.</br>";
			$uploadOk = 0;
		}
		// Check if file already exists
		if (file_exists($target_file)) {
			$msg .= "Sorry, file already exists.</br>";
			$uploadOk = 0;
		}
		// Check file size
		if ($image["size"] > $this->maxFileSize) {
			$msg .= "Sorry, your file is too large.</br>";
			$uploadOk = 0;
		}
		// Allow certain file formats
		if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
		&& $imageFileType != "gif" ) {
			$msg .= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.</br>";
			$uploadOk = 0;
		}

		// Check if $uploadOk is set to 0 by an error
		if ($uploadOk == 0) {
			$msg .= "Sorry, your file was not uploaded.</br>";
		// if everything is ok, try to upload file
		} else {

			if (move_uploaded_file($image["tmp_name"], $target_file)) {
				$sql = "INSERT IGNORE INTO `imagenes` VALUES (null,'".$image["name"]."',1)";
				if ($this->db->query($sql) === TRUE) {
					if (mysqli_warning_count($this->db)) {
						$e = mysqli_get_warnings($this->db);
						do {
							$msg .= "Warning: $e->errno: $e->message</br>";
						} while ($e->next());
					}else{
						$arr = array('id' => $this->db->insert_id, 'nombre' => $image["name"]);
						$json = json_encode($this->utf8_converter($arr));
						return $this->logResultado(1,$json);
					}
				} else {
					$msg .= "Error: " . $sql . "<br>" . $this->db->error;
				}
			} else {
				$msg .= "Sorry, there was an error uploading your file.</br>";
			}
		}
		return $this->logResultado(0,$msg);
	}

	public function getImage($id){
		$sql = "SELECT * FROM `imagenes` WHERE `id` = $id; ";
		if ($res = $this->db->query($sql)) {
			$image = $res->fetch_assoc();
			return $this->logResultado(1,json_encode($this->utf8_converter($image)));
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
	}

	public function getAllImages(){
		$sql = "SELECT * FROM `imagenes` ORDER BY posicion";
		if ($res = $this->db->query($sql)) {
			while($row = $res->fetch_array(MYSQLI_ASSOC)) {
				$images[$row["id"]] = $row;
			}
			return $this->logResultado(1,$images);
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
	}

	public function setPosicion($id,$posicion){
		$sql = "UPDATE `imagenes` SET `posicion` = $posicion WHERE `imagenes`.`id` = $id; ";

		if ($res = $this->db->query($sql)) {
			$sql = "SELECT `id`,`posicion` FROM `imagenes` AS `is` WHERE `is`.`id` != $id AND `is`.`posicion` >= $posicion ORDER BY posicion;";
			if ($res = $this->db->query($sql)) {
				$images;
				while($row = $res->fetch_array(MYSQLI_ASSOC)) {
					$images[] = $row;
				}
				//$sql = "UPDATE `imagenes` SET `posicion` = alias_tabla1.`id` + 1 WHERE `imagenes`.`id` =  ( SELECT id FROM (SELECT `id`,`posicion` FROM `imagenes` AS `is` WHERE `is`.`id` != $id AND `is`.`posicion` >= $posicion ORDER BY posicion) AS alias_tabla1);";
				$sql = "UPDATE `imagenes` SET `posicion` = (CASE";
				foreach ($images as $image) {
					$sql .= " WHEN `id` = ". $image["id"]." THEN ". ++$posicion;
				}
				$sql .= " END) WHERE  `id` IN (";
				foreach ($images as $image) {
					$sql .= $image["id"].",";
				}
				$sql = substr($sql, 0, -1);
				$sql .= ");";
				if ($res = $this->db->query($sql)) {
					return $this->logResultado(1,'');
				} else {
					return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
				}
			} else {
				return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
			}
			//die($sql);
			if ($this->db->query($sql) === TRUE) {
				return $this->logResultado(1,'');
			} else {
				return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
			}
		} else {
			return $this->logResultado(0,"Error: " . $sql . "<br>" . $this->db->error);
		}
	}
}
