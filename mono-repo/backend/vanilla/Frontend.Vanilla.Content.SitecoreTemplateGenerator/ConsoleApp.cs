using System;
using System.Collections.Generic;
using System.Linq;
using McMaster.Extensions.CommandLineUtils;

namespace Frontend.Vanilla.Content.SitecoreTemplateGenerator;

public class ConsoleApp
{
    private readonly string[] args;
    private readonly CommandLineApplication app;
    private readonly CommandOption targetFile;
    private readonly CommandOption targetNamespace;
    private readonly CommandOption mappingProfileType;
    private readonly CommandOption mappingProfileAssembly;
    private readonly CommandOption excludeVanillaBaseTemplates;
    private readonly CommandOption sitecoreHost;
    private readonly CommandOption sitecoreTemplatePaths;

    public string TargetFile => targetFile.Value()?.Trim();
    public string TargetNamespace => targetNamespace.Value()?.Trim();
    public string MappingProfileType => mappingProfileType.Value()?.Trim();
    public string MappingProfileAssembly => mappingProfileAssembly.Value()?.Trim();
    public bool ExcludeVanillaBaseTemplates => excludeVanillaBaseTemplates.HasValue();
    public string SitecoreHost => sitecoreHost.Value()?.Trim() ?? "http://rest.cms.prod.env.works/";
    public List<string> TemplatePaths => sitecoreTemplatePaths.Values.Select(x => x?.Trim()).ToList();

    public ConsoleApp(string[] args)
    {
        this.args = args;

        app = new CommandLineApplication();
        app.HelpOption();

        targetFile = app.Option("-o|--output-file", "The output file for the generated code.", CommandOptionType.SingleValue, o => o.IsRequired());
        targetNamespace = app.Option("-n|--namespace", "The namespace for the generated code.", CommandOptionType.SingleValue, o => o.IsRequired());
        mappingProfileType = app.Option(
            "-m|--mapping-profile-type",
            "The mapping profile to use for generating templates.",
            CommandOptionType.SingleValue,
            o => o.IsRequired());
        mappingProfileAssembly = app.Option(
            "-a|--mapping-profile-assembly",
            "The assembly that contains the mapping profile type.",
            CommandOptionType.SingleValue,
            o => o.IsRequired());
        excludeVanillaBaseTemplates = app.Option("-b|--exclude-base-templates", "Whether to exclude vanilla base types.", CommandOptionType.NoValue);
        sitecoreHost = app.Option("-h|--host", "The sitecore host url.", CommandOptionType.SingleValue);
        sitecoreTemplatePaths = app.Option("-p|--template-path", "The template paths to generate code from.", CommandOptionType.MultipleValue);
    }

    public int Execute(Func<int> action)
    {
        app.OnExecute(action);

        return app.Execute(args);
    }
}
