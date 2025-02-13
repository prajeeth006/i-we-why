using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Moq;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public abstract class ClientContentMapperTestsBase<TSource, TTarget>
    where TSource : class, IDocument
    where TTarget : class, new()
{
    protected Mock<TSource> SourceDoc { get; private set; }
    protected TTarget TargetDoc { get; private set; }
    protected Mock<IClientContentContext> Context { get; private set; }

    public ClientContentMapperTestsBase()
    {
        SourceDoc = new Mock<TSource>();
        TargetDoc = new TTarget();
        Context = new Mock<IClientContentContext>();

        Context.Setup(c => c.CreateText(It.IsAny<string>())).Returns<string>(s => "client: " + s);
    }

    protected Task RunTest(IClientContentMapper<TSource, TTarget> targetMapper) => targetMapper.MapAsync(SourceDoc.Object, TargetDoc, Context.Object);

    protected IReadOnlyList<ClientDocument> SetupDocuments<TProperty>(Expression<Func<TSource, TProperty>> sourcePropertyExpr)
        where TProperty : class, IEnumerable<DocumentId>
    {
        var ids = new DocumentId[] { Guid.NewGuid().ToString(), Guid.NewGuid().ToString() };
        var docs = new[] { new ClientDocument(), new ClientDocument() };

        SourceDoc.SetupGet(sourcePropertyExpr).Returns((TProperty)(object)ids);
        Context.Setup(c => c.LoadAsync(ids)).ReturnsAsync(docs);

        return docs;
    }

    protected ClientDocument SetupDocument(DocumentId id)
    {
        var doc = new ClientDocument();
        Context.Setup(c => c.LoadAsync(id)).ReturnsAsync(doc);

        return doc;
    }

    protected ContentParameters SetupOptionalCollection(Expression<Func<TSource, ContentParameters>> sourcePropertyExpr)
    {
        var collection = new Dictionary<string, string> { { Guid.NewGuid().ToString(), "value" } }.AsContentParameters();

        return SetupProperty(sourcePropertyExpr, collection, c => c.CreateOptionalCollection(collection), ContentParameters.Empty);
    }

    private TClient SetupProperty<TServer, TClient>(
        Expression<Func<TSource, TServer>> sourcePropertyExpr,
        TServer serverValue,
        Expression<Func<IClientContentContext, TClient>> contextMappingExpr,
        TClient clientValue)
    {
        SourceDoc.SetupGet(sourcePropertyExpr).Returns(serverValue);
        Context.Setup(contextMappingExpr).Returns(clientValue);

        return clientValue;
    }

    protected void VerifyNoDocumentsByIdsLoaded()
        => Context.Verify(c => c.LoadAsync(It.IsAny<IEnumerable<DocumentId>>()), Times.Never);
}
