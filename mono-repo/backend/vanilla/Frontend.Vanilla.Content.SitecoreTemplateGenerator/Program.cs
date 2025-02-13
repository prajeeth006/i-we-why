using System;
using Frontend.Vanilla.Content.SitecoreTemplateGenerator;
using Frontend.Vanilla.Core.Collections;

Console.WriteLine("Received args: " + args.Join());
var app = new ConsoleApp(args);

return app.Execute(() =>
{
    var generator = new SitecoreCodeGenerator(
        app.MappingProfileAssembly,
        app.MappingProfileType,
        !app.ExcludeVanillaBaseTemplates,
        app.TargetFile,
        app.TemplatePaths,
        app.SitecoreHost,
        app.TargetNamespace);

    var success = generator.Execute();

    return success ? 0 : 1;
});
