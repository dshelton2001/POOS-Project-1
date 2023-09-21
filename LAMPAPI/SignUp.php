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
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Username, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $fName, $lName, $userName, $pwd);

		$check = $conn->prepare("SELECT COUNT(*) FROM Users WHERE Username = ? AND Password = ?");
		$check->bind_param("s", $userName);
		$check->execute();

		//make if statement 
		if($check == 1){
			returnWithError("That username already exists.");
		}

		$stmt->execute();
		$stmt->close();
		$check->close();
		$conn->close();
		returnWithError("");
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
