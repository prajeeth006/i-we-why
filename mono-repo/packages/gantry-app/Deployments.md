After Completion of the Task
1. check ng test
2. After Pushing Code check for Pipeline
3. Once Clent-build, fortify, server-build and Iron-Dome are Success then Create Merge Request to Respective Master or RB
4. On Approval of Merge Request
5. check the current version for the specific environment
```
example : test => https://test.gantry.coral.co.uk/site/version

        "VanillaFramework 16.0.0+215e494a
        Framework net6
        Gantry 1.0.0.1+b180d763"
```
6. click on `disme-upload` in pipeline
7. Access the disme site with right access (URL : https://disme.prod.env.works/out/out.ViewFolder.php?folderid=1)
8. Click on gantry project
9. Click on Gantry.Web.Host
10. Click on Frontend.Gantry.Host
11. In the current version section we can find Deploy to Server
12. Cross check the Version of your code (XXXXX-commit-id.zip)
13. Select the Target Environment (example : Functional Verification Test)
14. Select the server on activating the check box
15. Click on Deploy only
16. Once Script executed successfully check the version again to verify deployment happened successfully.
```
example : test => https://test.gantry.coral.co.uk/site/version
"VanillaFramework 16.0.0+215e494a
Framework net6
Gantry 1.0.0.1+5923ddab"
```
17. Also Test your changes after deployment.
