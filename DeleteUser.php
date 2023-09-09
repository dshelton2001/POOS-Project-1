<?php

    $inData = getRequestInfo();
    $userName = $inData["userName"];
    #$pwd = $inData["pwd"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("DELETE FROM Users WHERE Username=?");
		$stmt->bind_param("s",$userName);
		$stmt->execute();
		$stmt->close();
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