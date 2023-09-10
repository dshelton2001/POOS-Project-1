<?php

    $inData = getRequestInfo();
    $contactUserID = $inData["contactUserID"]; #The Contact Book Holder
    $uniqueID = $inData["uniqueID"]; #Index of our Database,

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE (ID=? AND UserID=?)");
		$stmt->bind_param("ss",$uniqueID,$contactUserID);
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