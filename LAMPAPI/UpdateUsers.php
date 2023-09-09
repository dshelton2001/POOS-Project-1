<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$stmt1 = $conn->prepare("UPDATE Users SET Username = ? WHERE ID=?");
		$updatedUser = $inData["updatedUser"];
        $userID = $inData["Id"];
		$stmt1->bind_param("ss", $updatedUser, $userID);

        //query code
        $stmt2 = $conn->prepare("SELECT Username FROM Users");
        $stmt2->bind_param("s", $userID);
        $stmt2->execute();
        $result0 = $stmt2->get_result();

        if ($result0) {
            if (mysqli_num_rows($result0) > 0) {
                returnWithError( "Username already taken" );
                $stmt2->close();
                $conn->close();
            } else {
                
            }
        } else {
            returnWithError( "No Records Found" );
            $stmt2->close();
            $conn->close();
        }
        
        ///////////////////

		$stmt1->execute();
		
		$result = $stmt1->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Updated User" : "' . $row["Username"] . '", "Updated Pass" : "' . $row["Password"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt1->close();
		$conn->close();
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