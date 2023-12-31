<?php

	$inData = getRequestInfo();

	$fName = $inData["fName"];
	$lName = $inData["lName"];
	$userName = $inData["userName"];
	$pwd = $inData["pwd"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$check = $conn->prepare("SELECT COUNT(*) FROM Users WHERE Username = ?");
		$check->bind_param("s", $userName);
		$check->execute();
		$check->bind_result($res);
		$check->fetch();

		//make if statement 
		if($res == 1){
			$check->close();
			$conn->close();
			returnWithError("That username already exists.");
		} else {
			$check->close();

			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Username, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $fName, $lName, $userName, $pwd);
			$stmt->execute();
			$stmt->close();
	
			$conn->close();
			returnWithError("");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
