using System;
using FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.AcceptanceTests;

public sealed class SyntaxAcceptanceTests : AcceptanceTestsBase
{
    [Theory]
    // Literals
    [InlineData(typeof(string), "'Chuck Norris'")]
    [InlineData(typeof(string), @"""Chuck Norris""")]
    [InlineData(typeof(decimal), "666")]
    [InlineData(typeof(bool), "TRUE")]
    [InlineData(typeof(bool), "FALSE")]

    // Providers
    [InlineData(typeof(string), "User.LoginName")]
    [InlineData(typeof(bool), "User.IsKnown")]
    [InlineData(typeof(decimal), "Balance.AccountBalance")]
    [InlineData(typeof(bool), "List.Contains('vip-users', User.LoginName)")]

    // Unary operators
    [InlineData(typeof(bool), "NOT User.IsKnown")]
    [InlineData(typeof(string), "LOWERCASE User.LoginName")]
    [InlineData(typeof(string), "UPPERCASE User.LoginName")]
    [InlineData(typeof(decimal), "NUMBER User.LoginName")]
    [InlineData(typeof(string), "STRING Balance.AccountBalance")]
    [InlineData(typeof(string), "TRIM User.LoginName")]
    [InlineData(typeof(decimal), "ROUND Balance.AccountBalance")]
    [InlineData(typeof(decimal), "FLOOR Balance.AccountBalance")]
    [InlineData(typeof(decimal), "CEIL Balance.AccountBalance")]

    // Binary operators
    [InlineData(typeof(bool), "User.IsKnown AND TRUE")]
    [InlineData(typeof(bool), "User.IsKnown OR TRUE")]
    [InlineData(typeof(string), "User.LoginName OR 'Chuck Norris'")]
    [InlineData(typeof(decimal), "Balance.AccountBalance OR 666")]
    [InlineData(typeof(bool), "User.LoginName = 'Chuck Norris'")]
    [InlineData(typeof(bool), "User.LoginName <> 'Chuck Norris'")]
    [InlineData(typeof(bool), "Balance.AccountBalance < 100")]
    [InlineData(typeof(bool), "Balance.AccountBalance <= 100")]
    [InlineData(typeof(bool), "Balance.AccountBalance > 100")]
    [InlineData(typeof(bool), "Balance.AccountBalance >= 100")]
    [InlineData(typeof(bool), "User.LoginName MATCHES 'Chuck Norris'")]
    [InlineData(typeof(bool), "User.LoginName CONTAINS 'Chuck Norris'")]
    [InlineData(typeof(bool), "User.LoginName STARTS-WITH 'Chuck Norris'")]
    [InlineData(typeof(bool), "User.LoginName ENDS-WITH 'Chuck Norris'")]
    [InlineData(typeof(decimal), "User.LoginName INDEX-OF 'wtf'")]
    [InlineData(typeof(decimal), "User.LoginName LAST-INDEX-OF 'wtf'")]
    [InlineData(typeof(decimal), "LENGTH User.LoginName")]
    [InlineData(typeof(string), "User.LoginName SUBSTRING-FROM 2")]
    [InlineData(typeof(string), "User.LoginName SUBSTRING-FROM 2 TAKE 3")]
    [InlineData(typeof(string), "User.LoginName TAKE 3")]
    [InlineData(typeof(decimal), "Balance.AccountBalance + 66")]
    [InlineData(typeof(string), "User.LoginName + ' from BWIN'")]
    [InlineData(typeof(decimal), "Balance.AccountBalance - 66")]
    [InlineData(typeof(decimal), "Balance.AccountBalance * 66")]
    [InlineData(typeof(decimal), "Balance.AccountBalance / 66")]
    [InlineData(typeof(decimal), "Balance.AccountBalance % 66")]

    // Other syntax operators
    [InlineData(typeof(bool), "(User.IsKnown)")]
    [InlineData(typeof(bool), "User.LoginName IN ['Chuck Norris', 'Bruce Lee']")]

    // Complex expressions
    [InlineData(typeof(bool), "(NOT User.IsKnown AND User.LoginName IN ['Chuck Norris', 'Bruce Lee']) OR User.IsKnown")]
    public void ShouldSupportSyntax(Type type, string expression)
    {
        var result = SyntaxValidator.Validate(expression, type);
        result.ErrorMessage.Should().BeNull();
    }
}
