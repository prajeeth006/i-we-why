using System;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.AcceptanceTests;

public interface IFooConfiguration
{
    string Value { get; }
    IDslExpression<bool> DslExpression { get; }
}

public interface IBarConfiguration : IDisableableConfiguration
{
    int BusinessValue { get; }
    IPerson Person { get; }
}

public interface IPerson
{
    string FirstName { get; }
    string LastName { get; }
}

public class FooConfiguration : IFooConfiguration
{
    [Required]
    public string Value { get; set; }

    public IDslExpression<bool> DslExpression { get; set; }
}

public class BarConfiguration : IBarConfiguration
{
    public bool IsEnabled { get; set; }
    public int BusinessValue { get; set; }
    public IPerson Person { get; set; }
}

public class BarConfigurationDto(bool isEnabled, int businessValue, Person person)
{
    public bool IsEnabled { get; } = isEnabled;
    public int BusinessValue { get; } = businessValue;
    public Person Person { get; } = person;

    // Different deserialization style
}

public class Person : IPerson
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class BarConfigurationFactory : IConfigurationFactory<IBarConfiguration, BarConfigurationDto>
{
    public WithWarnings<IBarConfiguration> Create(BarConfigurationDto dto)
        => new BarConfiguration { IsEnabled = dto.IsEnabled, BusinessValue = dto.BusinessValue, Person = dto.Person }
            .WithWarnings<IBarConfiguration>();
}

public sealed class DslProviderWithConfig : ICookiesDslProvider
{
    public DslProviderWithConfig(IFooConfiguration config) { }

    public string LabelDomain => throw new NotImplementedException();
    public string FullDomain => throw new NotImplementedException();
    public string Get(string name) => throw new NotImplementedException();
    public void SetSession(string name, string value) => throw new NotImplementedException();
    public void SetPersistent(string name, string value, decimal expiration) => throw new NotImplementedException();
    public void Delete(string name) => throw new NotImplementedException();
    public void Set(string name, string value, decimal expiration, bool httpOnly, string domain, string path) => throw new NotImplementedException();
}
