using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Diagnostics;

/// <summary>
/// Compares templates from Sitecore service against those from the code of this app.
/// </summary>
internal interface IContentTemplatesComparer
{
    [NotNull]
    IEnumerable<(bool IsCritical, string Message)> Compare(
        [NotNull, ItemNotNull] IEnumerable<SitecoreTemplate> localTemplates,
        [NotNull, ItemNotNull] IEnumerable<SitecoreTemplate> sitecoreTemplates);
}

internal sealed class ContentTemplatesComparer : IContentTemplatesComparer
{
    public IEnumerable<(bool IsCritical, string Message)> Compare(IEnumerable<SitecoreTemplate> localTemplates, IEnumerable<SitecoreTemplate> sitecoreTemplates)
    {
        var localTemplatesByName = localTemplates.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var sitecoreTemplate in sitecoreTemplates)
        {
            if (!localTemplatesByName.Remove(sitecoreTemplate.Name, out var localTemplate))
            {
                yield return (false, $"Template {sitecoreTemplate} isn't mapped.");

                continue;
            }

            foreach (var issue in CompareBaseTemplates(localTemplate, sitecoreTemplate)) yield return issue;
            foreach (var issue in CompareOwnFields(localTemplate, sitecoreTemplate)) yield return issue;
        }

        foreach (var missingTemplate in localTemplatesByName.Values)
            yield return (true, $"Template {missingTemplate} doesn't exist on Sitecore side. Code loading it will fail.");
    }

    private static IEnumerable<(bool IsCritical, string Message)> CompareBaseTemplates(SitecoreTemplate localTemplate, SitecoreTemplate sitecoreTemplate)
    {
        var localBaseTemplates = localTemplate.BaseTemplates.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var sitecoreBaseTemplate in sitecoreTemplate.BaseTemplates)
            if (!localBaseTemplates.Remove(sitecoreBaseTemplate.Name))
                yield return (false, $"Template {localTemplate} doesn't have {sitecoreBaseTemplate} mapped in the code as one of its base templates.");

        foreach (var missingTemplate in localBaseTemplates.Values)
            if (missingTemplate.AllFields.Count > 0)
                yield return (true,
                    $"Template {sitecoreTemplate} doesn't have {missingTemplate} as its base template on Sitecore side. Deserialization of base fields can fail.");
            else
                yield return (false, $"Template {sitecoreTemplate} doesn't have {missingTemplate} as its base template on Sitecore side. However it has no fields.");
    }

    private static IEnumerable<(bool IsCritical, string Message)> CompareOwnFields(SitecoreTemplate localTemplate, SitecoreTemplate sitecoreTemplate)
    {
        var localFields = localTemplate.OwnFields.ToDictionary(f => f.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var sitecoreField in sitecoreTemplate.OwnFields)
        {
            var fieldInfo = $"Field '{sitecoreField.Name}' of template {sitecoreTemplate}";

            if (!localFields.Remove(sitecoreField.Name, out var localField))
            {
                yield return (false, $"{fieldInfo} isn't mapped.");

                continue;
            }

            if (!sitecoreField.Type.EqualsIgnoreCase(localField.Type))
                yield return (true, $"{fieldInfo} has type '{sitecoreField.Type}' on Sitecore side but '{localField.Type}' in the code. Its deserialization can fail.");
            if (sitecoreField.Shared != localField.Shared)
                yield return (true,
                    $"{fieldInfo} has Shared flag equal to {sitecoreField.Shared} on Sitecore side but {localField.Shared} in the code. Its translation validation can fail.");
        }

        foreach (var missingField in localFields.Values)
            yield return (true, $"Field {missingField} of template {localTemplate} doesn't exist on Sitecore side. Code loading it will fail.");
    }
}
