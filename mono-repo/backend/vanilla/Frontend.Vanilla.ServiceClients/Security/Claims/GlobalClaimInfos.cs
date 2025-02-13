#nullable enable

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication;

namespace Frontend.Vanilla.ServiceClients.Security.Claims;

/// <summary>
/// Collects all info regarding global (on all products) claims known to Vanilla.
/// </summary>
internal interface IGlobalClaimInfos
{
    IReadOnlyList<ClaimInfo> Infos { get; }
}

internal sealed class ClaimInfo(TrimmedRequiredString issuer, TrimmedRequiredString type, TrimmedRequiredString description)
{
    public TrimmedRequiredString Issuer { get; } = issuer;
    public TrimmedRequiredString Type { get; } = type;
    public TrimmedRequiredString Description { get; } = description;
}

internal sealed class GlobalClaimInfos : IGlobalClaimInfos
{
    public IReadOnlyList<ClaimInfo> Infos { get; } = GetAllClaimInfos(typeof(PosApiClaimTypes)).ToList();

    private static IEnumerable<ClaimInfo> GetAllClaimInfos(Type type)
    {
        foreach (var member in type.GetMembers(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static).Where(m => m.DeclaringType != typeof(object)))
            switch (member)
            {
                case FieldInfo field when field.IsStatic && field.FieldType == typeof(string):
                    var claimType = (string)field.GetValue(null)!;
                    var issuer = PosApiClaimsDeserializer.VanillaClaimTypes.Contains(claimType)
                        ? PosApiClaimsDeserializer.VanillaIssuer
                        : PosApiClaimsDeserializer.PosApiIssuer;
                    var desc = field.Get<DescriptionAttribute>()?.Description.WhiteSpaceToNull()
                               ?? throw new Exception($"Missing {typeof(DescriptionAttribute)} with a valid documentation on field {field} of {type}.");

                    yield return new ClaimInfo(issuer, claimType, desc);

                    break;

                case Type nestedType:
                    foreach (var pair in GetAllClaimInfos(nestedType))
                        yield return pair;

                    break;

                default:
                    throw new Exception($"Unsupported member {member.MemberType} {member} on {type}. Only fields and nested classes are supported.");
            }
    }
}
