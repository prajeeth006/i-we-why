using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class ContentTests
{
    private DocumentId id;
    private IDocumentMetadata metadata;
    private IPCText document;
    private IEnumerable<TrimmedRequiredString> errors;

    public ContentTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        id = "test-v1.0/page";
        metadata = Mock.Of<IDocumentMetadata>();
        document = Mock.Of<IPCText>();
        errors = new TrimmedRequiredString[] { "Error 1", "Error 2" };

        Mock.Get(metadata).SetupGet(m => m.Id).Returns(() => id);
        Mock.Get(document).SetupGet(d => d.Metadata).Returns(() => metadata);
    }

    [Fact]
    public void SuccessContent_ShouldCreateCorrectly()
    {
        var target = new SuccessContent<IPCText>(document); // Act

        target.Id.Should().BeSameAs(id);
        target.Status.Should().Be(DocumentStatus.Success);
        target.Document.Should().BeSameAs(document);
        target.Metadata.Should().BeSameAs(metadata);
        ((Content<IPCText>)target).Metadata.Should().BeSameAs(metadata);
        target.ToString().Should()
            .Be("Success content /test-v1.0/page - zh-CN with Document of Castle.Proxies.IPCTextProxy");
    }

    [Theory]
    [InlineData(Failure.NullDocument)]
    [InlineData(Failure.NullMetadata)]
    [InlineData(Failure.NullId)]
    public void SuccessContent_ShouldThrow_IfNulls(Failure failure)
    {
        SetupFailure(failure);

        Func<object> act = () => new SuccessContent<IPCText>(document); // Act

        act.Should().Throw<ArgumentException>()
            .WithMessage("Document, its Metadata nor its Id can't be null. (Parameter 'document')");
    }

    [Fact]
    public void FilteredContent_ShouldCreateCorrectly()
    {
        var target = new FilteredContent<IPCText>(metadata); // Act

        target.Id.Should().BeSameAs(id);
        target.Status.Should().Be(DocumentStatus.Filtered);
        target.Metadata.Should().BeSameAs(metadata);
        ((Content<IPCText>)target).Metadata.Should().BeSameAs(metadata);
        target.ToString().Should().Be("Filtered content /test-v1.0/page - zh-CN");
    }

    [Theory]
    [InlineData(Failure.NullMetadata)]
    [InlineData(Failure.NullId)]
    public void FilteredContent_ShouldThrow_IfNulls(Failure failure)
    {
        SetupFailure(failure);

        Func<object> act = () => new FilteredContent<IPCText>(metadata); // Act

        act.Should().Throw<ArgumentException>()
            .WithMessage("Metadata nor its Id can't be null. (Parameter 'metadata')");
    }

    [Fact]
    public void NotFoundContent_ShouldCreateCorrectly()
    {
        var target = new NotFoundContent<IPCText>(id); // Act

        target.Id.Should().BeSameAs(id);
        target.Status.Should().Be(DocumentStatus.NotFound);
        target.Metadata.Should().BeNull();
        target.ToString().Should().Be("NotFound content /test-v1.0/page - zh-CN");
    }

    [Fact]
    public void NotFoundContent_ShouldThrow_IfNulls()
    {
        SetupFailure(Failure.NullId);

        Func<object> act = () => new NotFoundContent<IPCText>(id); // Act

        act.Should().Throw<ArgumentNullException>()
            .Which.ParamName.Should().Be("id");
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public void Invalid_ShouldCreateCorrectly(bool nullMetadata, bool errorsAsParams)
    {
        var target = RunInvalidContentCtor(nullMetadata, errorsAsParams);

        target.Id.Should().BeSameAs(id);
        target.Status.Should().Be(DocumentStatus.Invalid);
        target.Metadata.Should().BeSameAs(!nullMetadata ? metadata : null);
        target.Errors.Should().Equal(errors);
        target.ToString().Should().Be($"Invalid content /test-v1.0/page - zh-CN with Errors: 1) Error 1{Environment.NewLine}2) Error 2");
    }

    public static IEnumerable<object[]> TestCases => new List<object[]>
        {
            new object[] { Failure.NullId },
            new object[] { Failure.EmptyErrors },
            new object[] { Failure.NullErrors },
            new object[] { Failure.ErrorsContainNull },
        }
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans);

    [Theory, MemberData(nameof(TestCases))]
    public void Invalid_ShouldThrow_IfNulls(
        Failure failure,
        bool nullMetadata,
        bool errorsAsParams)
    {
        SetupFailure(failure);

        Action act = () => RunInvalidContentCtor(nullMetadata, errorsAsParams);

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(failure == Failure.NullId ? "id" : "errors");
    }

    [Theory]
    [InlineData(null, "null")]
    [InlineData("/other-v1.0/conflict", "/other-v1.0/conflict - zh-CN")]
    public void Invalid_ShouldThrowExplicitError_IfInconsistentIdAndMetadataId(string metadataId,
        string reportedMetadataId)
    {
        Mock.Get(metadata).SetupGet(m => m.Id).Returns(metadataId != null ? new DocumentId(metadataId) : null);

        Func<object> act = () => new InvalidContent<IPCText>(id, metadata, errors);

        act.Should().Throw<ArgumentException>().WithMessage(
            $"If metadata are specified then their Id must equal to explicit 'id' argument but it's {reportedMetadataId} vs. /test-v1.0/page - zh-CN. (Parameter 'metadata')");
    }

    private InvalidContent<IPCText> RunInvalidContentCtor(bool nullMetadata, bool errorsAsParams)
        => errorsAsParams
            ? new InvalidContent<IPCText>(id, !nullMetadata ? metadata : null, errors?.ToArray())
            : new InvalidContent<IPCText>(id, !nullMetadata ? metadata : null, errors);

    public enum Failure
    {
        /// <summary>
        /// Null Document
        /// </summary>
        NullDocument,

        /// <summary>
        /// Null Metadata
        /// </summary>
        NullMetadata,

        /// <summary>
        /// Null Id
        /// </summary>
        NullId,

        /// <summary>
        /// Null Errors
        /// </summary>
        NullErrors,

        /// <summary>
        /// Empty Errors
        /// </summary>
        EmptyErrors,

        /// <summary>
        /// Errors Contain Null
        /// </summary>
        ErrorsContainNull,
    }

    private void SetupFailure(Failure failure)
    {
        switch (failure)
        {
            case Failure.NullDocument:
                document = null;

                break;
            case Failure.NullMetadata:
                metadata = null;

                break;
            case Failure.NullId:
                id = null;

                break;
            case Failure.NullErrors:
                errors = null;

                break;
            case Failure.EmptyErrors:
                errors = TrimmedStrs.Empty;

                break;
            case Failure.ErrorsContainNull:
                errors = new TrimmedRequiredString[] { null, "Error" };

                break;
        }
    }
}
