using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit.Sdk;

namespace Frontend.Vanilla.Content.Tests.Fakes;

/// <summary>
/// If content isn't as expected but it's invalid then shows related errors first because that's what we want to usually know asap.
/// </summary>
internal static class ContentVerification
{
    public static TDocument VerifySuccess<TDocument>(
        this Content<TDocument> content,
        DocumentId expectedId = null,
        IDocumentMetadata expectedMetadata = null,
        IDocument expectedDocument = null)
        where TDocument : class, IDocument
    {
        content.VerifyNotInvalid(expectedId, expectedMetadata);

        var actualDoc = ((SuccessContent<TDocument>)content).Document;
        if (expectedDocument != null) actualDoc.Should().BeSameAs(expectedDocument);

        return actualDoc;
    }

    public static NotFoundContent<TDocument> VerifyNotFound<TDocument>(this Content<TDocument> content, DocumentId expectedId = null)
        where TDocument : class, IDocument
    {
        content.VerifyNotInvalid(expectedId, null);

        return (NotFoundContent<TDocument>)content;
    }

    public static FilteredContent<TDocument> VerifyFiltered<TDocument>(
        this Content<TDocument> content,
        DocumentId expectedId = null,
        IDocumentMetadata expectedMetadata = null)
        where TDocument : class, IDocument
    {
        content.VerifyNotInvalid(expectedId, expectedMetadata);

        return (FilteredContent<TDocument>)content;
    }

    public static InvalidContent<TDocument> VerifyInvalid<TDocument>(
        this Content<TDocument> content,
        DocumentId expectedId = null,
        IDocumentMetadata expectedMetadata = null,
        string expectedError = null)
        where TDocument : class, IDocument
    {
        content.Verify(expectedId, expectedMetadata);

        var invalid = (InvalidContent<TDocument>)content;
        if (expectedError != null) invalid.Errors.Single().Value.Should().Be(expectedError);

        return invalid;
    }

    private static void VerifyNotInvalid<TDocument>(this Content<TDocument> content, DocumentId expectedId, IDocumentMetadata expectedMetadata)
        where TDocument : class, IDocument
    {
        content.Verify(expectedId, expectedMetadata);

        if (content is InvalidContent<TDocument> invalid) // Explicit check to display Errors in  failed test
            throw new XunitException("Expected content not to be Invalid but it's is with errors: " + invalid.Errors.ToDebugString());
    }

    private static void Verify<TDocument>(this Content<TDocument> content, DocumentId expectedId, IDocumentMetadata expectedMetadata = null)
        where TDocument : class, IDocument
    {
        content.Should().NotBeNull();
        if (expectedId != null) content.Id.Should().Be(expectedId);
        if (expectedMetadata != null) content.Metadata.Should().BeSameAs(expectedMetadata);
    }
}
