$version = "0.0.0"
$assemblyVersion ="0.0.0"

$parts = ($env:CI_COMMIT_BRANCH).Split("-")

Write-output $parts

if(($parts[0].ToLower() -eq "release") -or ($parts[0].ToLower() -eq "rb")) {
    $assemblyVersion = $parts[-1] + "." + $env:CI_PIPELINE_IID
	$version=  $env:CI_COMMIT_BRANCH + "." + $env:CI_PIPELINE_IID
}

Write-output $version

$versionXml="<Project>
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <Product>GantryTradingConnector</Product>
  <Company>Entain</Company>
  <Copyright>Entain © 2023</Copyright>
  <AssemblyVersion>$assemblyVersion</AssemblyVersion>
  <FileVersion>$version</FileVersion>
  <InformationalVersion>$version</InformationalVersion>
  <LangVersion>latest</LangVersion>
</PropertyGroup>
</Project>"

$versionXml > .\GantryTradingConnector\Directory.Build.props