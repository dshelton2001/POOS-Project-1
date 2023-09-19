<?php

    $inData = getRequestInfo();
    $userName = $inData["userName"];
    #$pwd = $inData["pwd"]; <---- will this be needed for Front End Checking?

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        # delete the user
        $stmt = $conn->prepare("DELETE FROM Users WHERE ID=?");
		$stmt->bind_param("s",$userID);
		$stmt->execute();
		$stmt->close();

		# look for the old contacts associated with the user
		$stco = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
		$stco->bind_param("s",$userID);
		$stco->execute();

		$stco->close();
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
